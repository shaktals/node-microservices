import express, { Request, Response } from 'express'
import { param } from 'express-validator'

import { NotFoundError, validateRequest } from '@shaktickets/common'

import { Ticket } from '../models/Ticket'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})
    res.send(tickets)
  }
)

export { router as ticketIndexRouter }
