import { CustomError } from './CustomError'

const message = 'Not authorized'
export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super(message)

    // As this extends a built-in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [{ message }]
  }
}
