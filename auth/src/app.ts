import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/currentUser'
import { signInRouter } from './routes/signIn'
import { signOutRouter } from './routes/signOut'
import { signUpRouter } from './routes/signUp'

import { errorHandler } from './middlewares/errorHandler'
import { currentUser } from './middlewares/currentUser'
import { requireAuth } from './middlewares/requireAuth'

import { NotFoundError } from './errors/NotFoundError'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
)
app.use(currentUser)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)

// Routes that require authentication
app.use(requireAuth)
app.use(signOutRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }