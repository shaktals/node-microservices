import request from 'supertest'

import { Subjects } from '@shaktickets/common'

import { app } from '../../app'
import { Ticket } from '../../models/Ticket'
import { natsWrapper } from '../../natsWrapper'

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('does not return 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send({})
  
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send({ title: '', price: 10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send({ title: 'Random', price: -10 })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send({ title: 'Valid' })
    .expect(400)
})

it('creates a ticket if inputs are valid', async () => {
  // Sanity check
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const ticketAttrs = { title: 'Random', price: 10 }

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send(ticketAttrs)
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0]).toMatchObject(ticketAttrs)
})

it('publishes a ticket:created event if inputs are valid', async () => {
  // Sanity check
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const ticketAttrs = { title: 'Random', price: 10 }

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.createCookie().cookie)
    .send(ticketAttrs)
    .expect(201)

  const ticketStr = JSON.stringify(response.body)

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.TicketCreated,
    ticketStr,
    expect.any(Function)
  )
})
