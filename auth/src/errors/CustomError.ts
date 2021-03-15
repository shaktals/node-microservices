export interface ErrorObject {
  message: string;
  field?: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)

    // As this extends a built-in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): ErrorObject[]
}
