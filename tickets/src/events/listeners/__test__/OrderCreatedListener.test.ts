import { Message } from 'node-nats-streaming'

import { OrderCreatedEvent, OrderStatus, Subjects, TicketUpdatedEvent } from '@shaktickets/common'

import { OrderCreatedListener } from '../OrderCreatedListener'
import { natsWrapper } from '../../../natsWrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  const ticket = Ticket.build({
    userId: global.generateId(),
    title: 'Cool concert',
    price: 20,
  })

  await ticket.save()

  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    version: 0,
    status: OrderStatus.Created,
    userId: global.generateId(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('create and saves a ticket and acknowledges the message', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket?.version).toEqual(ticket.version + 1)
  expect(updatedTicket?.orderId).toEqual(data.id)
  expect(msg.ack).toHaveBeenCalledTimes(1)
})

it('publishes a TicketUpdatedEvent once the ticket is successfully updated', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
  const updateEvent = (natsWrapper.client.publish as jest.Mock).mock.calls[0]

  const ticket = await Ticket.findById(data.ticket.id)

  expect(updateEvent[0]).toEqual(Subjects.TicketUpdated)
  expect(ticket).toMatchObject(JSON.parse(updateEvent[1]))
  expect(msg.ack).toHaveBeenCalledTimes(1)
})
