import { Publisher, OrderCreatedEvent, Subjects } from '@shaktickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
