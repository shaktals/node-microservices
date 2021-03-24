import { Message, Stan } from 'node-nats-streaming'

import { Subjects, Listener, OrderCreatedEvent } from '@shaktickets/common'

import { queueGroupName } from './queueGroupName'
import { Order } from '../../models/Order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
    })
    await order.save()

    msg.ack()
  }
}
