import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'

import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@shaktickets/common'

import { Ticket } from '../models/Ticket'

const router = express.Router()

router.put('/api/tickets/:ticketId', requireAuth, [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    param('ticketId')
      .not()
      .isEmpty()
      .withMessage('Ticket id param is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const { ticketId } = req.params
    const { id } = req.currentUser!

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== id) {
      throw new NotAuthorizedError()
    }

    ticket.set({ title, price })
    await ticket.save()

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
