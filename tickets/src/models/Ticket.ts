import mongoose from 'mongoose'

// Describe props required for a new user
interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}

// Describe props that a User model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Describe props that a User document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  },
  versionKey: false,
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }