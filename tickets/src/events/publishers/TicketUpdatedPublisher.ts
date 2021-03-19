import { Publisher, Subjects, TicketUpdatedEvent } from '@shaktickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
