import request from 'supertest'

import { Subjects } from '@shaktickets/common'

import { app } from '../../app'
import { Ticket } from '../../models/Ticket'
import { natsWrapper } from '../../natsWrapper'

const ticketAttrs = {
  title: 'Cool show',
  price: 20,
}

const createTicket = async (userId: string) => {
  const ticket = Ticket.build({ ...ticketAttrs, userId })
  return await ticket.save()
}

const randomUserId = global.generateId()

it('returns 401 if user is not signed in', async () => {
  const ticket = await createTicket(randomUserId)
  const ticketUpdate = {
    ...ticketAttrs,
    price: 25,
  }

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .send(ticketUpdate)
    .expect(401)
})

it('returns 401 if ticket does not belong to user', async () => {
  const { cookie } = global.createCookie()

  const ticket = await createTicket(randomUserId)
  const ticketUpdate = {
    ...ticketAttrs,
    price: 25,
  }

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(401)
})

it('returns 404 if ticket does not exist', async () => {
  const { cookie } = global.createCookie()

  const ticketUpdate = {
    ...ticketAttrs,
    price: 25,
  }

  await request(app)
    .put(`/api/tickets/${global.generateId()}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(404)
})

it('returns 400 for invalid title or price', async () => {
  const { cookie, userId } = global.createCookie()

  const ticket = await createTicket(userId)
  const ticketUpdate = {
    ...ticketAttrs,
    price: 0,
  }

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(400)

  const newUpdateAttempt = {
    ...ticketAttrs,
    title: '',
  }

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(newUpdateAttempt)
    .expect(400)
})

it('returns 400 if ticket is reserved', async () => {
  const { cookie, userId } = global.createCookie()

  const ticket = await createTicket(userId)
  ticket.set({ orderId: global.generateId() })
  await ticket.save()

  const ticketUpdate = {
    ...ticketAttrs,
    price: 25,
  }

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(400)
})

it('updates the ticket given valid inputs', async () => {
  const { cookie, userId } = global.createCookie()

  const ticket = await createTicket(userId)
  const ticketUpdate = {
    title: 'Coolest',
    price: 25,
  }

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(200)
  
  expect(response.body).toMatchObject({ ...ticketUpdate, id: ticket.id })
})

it('publishes ticket:updated event given valid inputs', async () => {
  const { cookie, userId } = global.createCookie()

  const ticket = await createTicket(userId)
  const ticketUpdate = {
    title: 'Coolest',
    price: 25,
  }

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send(ticketUpdate)
    .expect(200)

  const ticketStr = JSON.stringify(response.body)

  expect(natsWrapper.client.publish).toHaveBeenCalledWith(
    Subjects.TicketUpdated,
    ticketStr,
    expect.any(Function)
  )
})
