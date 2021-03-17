import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest, BadRequestError } from '@shaktickets/common'
import { User } from '../models/User'
import { PasswordManager } from '../services/PasswordManager'

const router = express.Router()

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must not be empty')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Bad credentials')
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    )

    if (!passwordsMatch) {
      throw new BadRequestError('Bad credentials')
    }

    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
    }, process.env.JWT_KEY!)

    req.session = { jwt: userJwt }

    res.send(existingUser)
  }
)

export { router as signInRouter }
