import Queue from 'bull'

import { ExpirationCompletePublisher } from '../events/publishers/ExpirationCompletePublisher'
import { natsWrapper } from '../natsWrapper'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async (job) => {
  console.log('Publish event', job.data)

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  })
})

export { expirationQueue }
