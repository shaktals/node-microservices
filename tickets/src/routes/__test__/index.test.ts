import request from 'supertest'

import { app } from '../../app'
import { Ticket } from '../../models/Ticket'

it('can fetch a list of tickets', async () => {
  const tickets = [
    { title: 'Show 1', price: 10, userId: global.generateId() },
    { title: 'Show 2', price: 20, userId: global.generateId() },
    { title: 'Show 3', price: 30, userId: global.generateId() },
  ]

  await tickets.forEach(async tck => {
    const newTicket = Ticket.build(tck)
    await newTicket.save()
  })

  const response = await request(app)
    .get('/api/tickets')
    .expect(200)
  
  expect(response.body).toMatchObject(tickets)
})
