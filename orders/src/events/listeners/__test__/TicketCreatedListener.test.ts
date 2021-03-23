
import { Message } from 'node-nats-streaming'

import { TicketCreatedEvent } from '@shaktickets/common'

import { TicketCreatedListener } from '../TicketCreatedListener'
import { natsWrapper } from '../../../natsWrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent['data'] = {
    id: global.generateId(),
    version: 0,
    userId: global.generateId(),
    title: 'Cool concert',
    price: 30,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('create and saves a ticket and acknowledges the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
  expect(msg.ack).toHaveBeenCalledTimes(1)
})
