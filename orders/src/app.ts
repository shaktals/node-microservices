import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { errorHandler, currentUser, NotFoundError } from '@shaktickets/common'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: !['development', 'test'].includes(process.env.NODE_ENV!),
  })
)
app.use(currentUser)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
