import { Publisher, OrderCancelledEvent, Subjects } from '@shaktickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
