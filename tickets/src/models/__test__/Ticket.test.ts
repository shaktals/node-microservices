import { Ticket } from '../Ticket'

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'Cool concert',
    price: 10,
    userId: global.generateId(),
  })

  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  await firstInstance!.save()

  try {
    await secondInstance!.save()
  } catch (err) {
    return done()
  }

  throw new Error('Saving second instance should not work, should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Cool concert',
    price: 10,
    userId: global.generateId(),
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)

  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})
