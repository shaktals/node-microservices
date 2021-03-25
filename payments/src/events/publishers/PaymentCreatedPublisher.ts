import { Subjects, Publisher, PaymentCreatedEvent } from '@shaktickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
