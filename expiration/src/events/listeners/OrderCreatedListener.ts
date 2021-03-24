import { Message } from 'node-nats-streaming'

import { Listener, OrderCreatedEvent, Subjects } from '@shaktickets/common'

import { queueGroupName } from './queueGroupName'
import { expirationQueue } from '../../queues/expirationQueue'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQueue.add(
      { orderId: data.id },
      { delay },
    )

    msg.ack()
  }
}
