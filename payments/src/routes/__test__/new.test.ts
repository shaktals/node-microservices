import request from 'supertest'

import { app } from '../../app'
import { Order, OrderStatus } from '../../models/Order'
import { stripe } from '../../stripe'

it('returns a 404 if the order does not exist', async () => {
  const { cookie } = global.createCookie()

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: global.generateId(),
      token: 'random-string'
    })
    .expect(404)
})

it('returns a 401 if the user paying is not the order user', async () => {
  const order = Order.build({
    id: global.generateId(),
    userId: global.generateId(),
    version: 0,
    status: OrderStatus.Created,
    price: 20,
  })
  await order.save()

  const { cookie } = global.createCookie()

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'random-string'
    })
    .expect(401)
})

it('returns a 400 if the order has been cancelled', async () => {
  const { cookie, userId } = global.createCookie()

  const order = Order.build({
    id: global.generateId(),
    userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 20,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'random-string'
    })
    .expect(400)
})

it('returns a 201 if given valid inputs', async () => {
  const { cookie, userId } = global.createCookie()

  const order = Order.build({
    id: global.generateId(),
    userId,
    version: 0,
    status: OrderStatus.Created,
    price: 20,
  })
  await order.save()

  const token = 'tok_visa'

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token,
    })
    .expect(201)
  
  expect(stripe.charges.create).toHaveBeenCalledTimes(1)

  const chargeCalls = (stripe.charges.create as jest.Mock).mock.calls[0]
  expect(chargeCalls[0]).toMatchObject({
    amount: order.price * 100,
    currency: 'usd',
    source: token,
  })
})
