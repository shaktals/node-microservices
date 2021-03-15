import { CustomError } from './CustomError'

const message = 'Route not found'
export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super(message)

    // As this extends a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message }]
  }
}
