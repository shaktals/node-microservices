import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { requireAuth, validateRequest } from '@shaktickets/common'

import { natsWrapper } from '../natsWrapper'
import { Ticket } from '../models/Ticket'
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher'

const router = express.Router()

router.post('/api/tickets', requireAuth, [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const { id } = req.currentUser!

    const ticket = Ticket.build({ title, price, userId: id })
    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      id: ticket.id,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
