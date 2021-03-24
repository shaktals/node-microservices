import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

import { OrderStatus } from '@shaktickets/common'

// Describe props required for a new user
interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

// Describe props that a User document has
interface OrderDoc extends mongoose.Document {
  version: number
  userId: string
  price: number
  status: OrderStatus
}

// Describe props that a User model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  },
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = ({ id, ...rest }: OrderAttrs) => {
  return new Order({
    _id: id, ...rest,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order, OrderStatus }
