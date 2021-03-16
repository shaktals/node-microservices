import request from 'supertest'
import { app } from '../../app'

it('clears the cookie after signing out', async () => {
  const signUpResp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  const cookie = signUpResp.get('Set-Cookie')

  const response = await request(app)
    .get('/api/users/signout')
    .set('Cookie', cookie)
    .send({})
    .expect(200)

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  )
})
