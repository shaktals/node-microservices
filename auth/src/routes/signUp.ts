import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import { User } from '../models/User'
import { RequestValidationError } from '../errors/RequestValidationError'
import { BadRequestError } from '../errors/BadRequestError'

const router = express.Router()

router.post('/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const newUser = User.build({ email, password })
    await newUser.save()

    const response = newUser.toObject()
    delete response.password

    res.status(201).send(response)
  }
)

export { router as signUpRouter }
