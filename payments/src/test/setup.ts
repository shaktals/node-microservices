import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      createCookie(): { cookie: string[], userId: string }
      generateId(): string
    }
  }
}

jest.mock('../natsWrapper')
jest.mock('../stripe')

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'random-string'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.createCookie = () => {
  const payload = {
    id: global.generateId(),
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJson = JSON.stringify(session)
  const base64 = Buffer.from(sessionJson).toString('base64')

  return { cookie: [`express:sess=${base64}`], userId: payload.id }
}

global.generateId = () => mongoose.Types.ObjectId().toHexString()
