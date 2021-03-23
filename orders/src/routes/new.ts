import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@shaktickets/common'

import { natsWrapper } from '../natsWrapper'
import { Order } from '../models/Order'
import { Ticket } from '../models/Ticket'
import { OrderCreatedPublisher } from '../events/publishers/OrderCreatedPublisher'

const router = express.Router()

const EXPIRATION_WINDOW_SECS = 15 * 60

router.post('/api/orders', requireAuth, [
    body('ticketId')
      .not()
      .isEmpty()
      .withMessage('The prop ticketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    const { id } = req.currentUser!

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket has already been reserved')
    }

    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECS)

    const order = Order.build({ 
      status: OrderStatus.Created,
      userId: id,
      expiresAt,
      ticket,
    })
    await order.save()

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      }
    })

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
