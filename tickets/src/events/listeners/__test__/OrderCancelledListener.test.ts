import { Message } from 'node-nats-streaming'

import { OrderCancelledEvent, OrderStatus, Subjects, TicketUpdatedEvent } from '@shaktickets/common'

import { OrderCancelledListener } from '../OrderCancelledListener'
import { natsWrapper } from '../../../natsWrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  const ticket = Ticket.build({
    userId: global.generateId(),
    title: 'Cool concert',
    price: 20,
  })
  ticket.set({ orderId: global.generateId() })
  await ticket.save()

  const listener = new OrderCancelledListener(natsWrapper.client)

  const data: OrderCancelledEvent['data'] = {
    id: global.generateId(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('updates ticket orderId to undefined and acknowledges the message', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket?.version).toEqual(ticket.version + 1)
  expect(updatedTicket?.orderId).toEqual(undefined)
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
