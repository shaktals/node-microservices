import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Router from 'next/router'

import { stripeKey } from '../../api/constants'
import useRequest from '../../hooks/useRequest'

const OrderShow = ({ order, currentUser }) => {
  const [time, setTime] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: payment => Router.push('/orders')
  })

  const findTimeLeft = () => {
    const msLeft = new Date(order.expiresAt) - new Date()
    setTime(Math.round(msLeft / 1000))
  }

  useEffect(() => {
    findTimeLeft()
    const interval = setInterval(findTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [order])

  if (time < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
      Time left to pay: {time}s
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={stripeKey}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query

  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
