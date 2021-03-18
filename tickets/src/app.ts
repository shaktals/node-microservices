import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { errorHandler, currentUser, NotFoundError } from '@shaktickets/common'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { ticketIndexRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'development',
  })
)
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(ticketIndexRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
