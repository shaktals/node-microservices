
import { Message } from 'node-nats-streaming'

import { TicketUpdatedEvent } from '@shaktickets/common'

import { TicketUpdatedListener } from '../TicketUpdatedListener'
import { natsWrapper } from '../../../natsWrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  const ticket = Ticket.build({
    id: global.generateId(),
    title: 'Cool concert',
    price: 30,
  })

  await ticket.save()

  const listener = new TicketUpdatedListener(natsWrapper.client)

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    userId: global.generateId(),
    title: 'Coolest concert',
    price: 60,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('updates ticket and acknowledges the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
  expect(ticket!.version).toEqual(data.version)
  expect(msg.ack).toHaveBeenCalledTimes(1)
})

it('rejects to ticket update if out of version order', async (done) => {
  const { listener, data, msg, ticket } = await setup()

  data.version += 1

  try {
    await listener.onMessage(data, msg)
  } catch (err) {
    const notUpdatedTicket = await Ticket.findById(ticket.id)

    expect(notUpdatedTicket!.title).toEqual(ticket.title)
    expect(notUpdatedTicket!.price).toEqual(ticket.price)
    expect(notUpdatedTicket!.version).toEqual(ticket.version)

    expect(msg.ack).not.toHaveBeenCalled()
    return done()
  }

  throw new Error('Should not reach this point')
})
