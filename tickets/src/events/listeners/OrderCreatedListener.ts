import { Message } from 'node-nats-streaming'

import { Subjects, Listener, OrderCreatedEvent, TicketUpdatedEvent } from '@shaktickets/common'

import { Ticket } from '../../models/Ticket'
import { queueGroupName } from './queueGroupName'
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: data.id })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish(ticket as TicketUpdatedEvent['data'])

    msg.ack()
  }
}
