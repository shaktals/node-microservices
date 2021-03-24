import { Message } from 'node-nats-streaming'

import { Subjects, Listener, OrderCancelledEvent, TicketUpdatedEvent } from '@shaktickets/common'

import { Ticket } from '../../models/Ticket'
import { queueGroupName } from './queueGroupName'
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client)
      .publish(ticket as TicketUpdatedEvent['data'])

    msg.ack()
  }
}
