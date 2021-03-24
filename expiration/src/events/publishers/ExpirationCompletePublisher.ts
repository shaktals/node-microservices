import { Subjects, Publisher, ExpirationCompleteEvent } from '@shaktickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
