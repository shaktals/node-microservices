import { ValidationError } from 'express-validator'

import { CustomError } from './CustomError'

export class RequestValidationError extends CustomError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters')

    // As this extends a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map(({ msg, param }) => ({
      message: msg, field: param,
    }))
  }
}
