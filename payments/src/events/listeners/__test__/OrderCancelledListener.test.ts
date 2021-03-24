import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent, OrderStatus } from '@shaktickets/common'
import { natsWrapper } from '../../../natsWrapper'
import { OrderCancelledListener } from '../OrderCancelledListener'
import { Order } from '../../../models/Order'

const setup = async () => {
  const order = Order.build({
    id: global.generateId(),
    status: OrderStatus.Created,
    price: 10,
    userId: global.generateId(),
    version: 0,
  })
  await order.save()

  const listener = new OrderCancelledListener(natsWrapper.client)

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: global.generateId(),
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('updates the order status', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
