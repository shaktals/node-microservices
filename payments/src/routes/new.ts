import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@shaktickets/common'

import { Order } from '../models/Order'
import { stripe } from '../stripe'
import { Payment } from '../models/Payment'
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled')
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    })

    const payment = Payment.build({
      orderId, stripeId: charge.id,
    })
    await payment.save()

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: charge.id,
    })

    res.status(201).send({ id: payment.id })
  }
)

export { router as createChargeRouter }
