import request from 'supertest'

import { app } from '../../app'

const route = '/api/users/signup'

it('returns 201 on successful signup', async () => {
  return request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: 'very-secret',
    })
    .expect(201)
})

it('returns 400 on invalid email', async () => {
  return request(app)
    .post(route)
    .send({
      email: 'test',
      password: 'very-secret',
    })
    .expect(400)
})

it('returns 400 on invalid password', async () => {
  return request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: 'ver',
    })
    .expect(400)
})

it('returns 400 if email or password are missing', async () => {
  await request(app)
  .post(route)
  .send({
    email: '',
    password: 'very-secret',
  })
  .expect(400)

  return request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400)

})

it('disallows duplicate emails', async () => {
  await request(app)
  .post(route)
  .send({
    email: 'test@test.com',
    password: 'very-secret',
  })
  .expect(201)

  return request(app)
  .post(route)
  .send({
    email: 'test@test.com',
    password: 'very-secret',
  })
  .expect(400)
})

it('sets a cookie after successfull signup', async () => {
  const response = await request(app)
  .post(route)
  .send({
    email: 'test@test.com',
    password: 'very-secret',
  })
  .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})