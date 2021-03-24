import { Message } from 'node-nats-streaming'

import { ExpirationCompleteEvent, OrderStatus, Subjects } from '@shaktickets/common'

import { ExpirationCompleteListener } from '../ExpirationCompleteListener'
import { natsWrapper } from '../../../natsWrapper'
import { Ticket } from '../../../models/Ticket'
import { Order } from '../../../models/Order'

const setup = async () => {
  const ticket = Ticket.build({
    id: global.generateId(),
    title: 'Cool concert',
    price: 30,
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: global.generateId(),
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const listener = new ExpirationCompleteListener(natsWrapper.client)
 
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('updates the order status to cancelled and acks message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.orderId)
  expect(order?.status).toEqual(OrderStatus.Cancelled)
  expect(msg.ack).toHaveBeenCalledTimes(1)
})

it('emits and OrderCancelled event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const publishCall = (natsWrapper.client.publish as jest.Mock).mock.calls[0]

  expect(publishCall[0]).toEqual(Subjects.OrderCancelled)

  const eventData = JSON.parse(publishCall[1])
  expect(eventData.id).toEqual(data.orderId)
})
