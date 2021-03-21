import express, { Request, Response } from 'express'

import { NotFoundError } from '@shaktickets/common'

import { Ticket } from '../models/Ticket'

const router = express.Router()

router.get('/api/tickets/:ticketId',
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
