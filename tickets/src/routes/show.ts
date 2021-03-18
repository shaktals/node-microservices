import express, { Request, Response } from 'express'
import { param } from 'express-validator'

import { NotFoundError, validateRequest } from '@shaktickets/common'

import { Ticket } from '../models/Ticket'

const router = express.Router()

router.get('/api/tickets/:ticketId', [
    param('ticketId')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.params
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    res.send(ticket)
  }
)

export { router as showTicketRouter }
