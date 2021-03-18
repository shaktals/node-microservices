import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { Ticket } from '../../models/Ticket'

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})

it('return ticket if it exists', async () => {
  const ticketAttrs = { title: 'Cool show', price: 30, userId: 'random-string' }
  const ticket = Ticket.build(ticketAttrs)
  await ticket.save()

  await request(app)
    .get(`/api/tickets/${ticket.toJSON().id}`)
    .send()
    .expect(200)
})
