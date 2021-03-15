import { CustomError } from './CustomError'

const message = 'Error connecting to database'
export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = message

  constructor() {
    super(message)

    // As this extends a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.reason }]
  }
}
