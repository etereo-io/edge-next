import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { findUser } from '../../../../lib/api/users/user'
import handlerAuth from '../../../../pages/api/auth/[action]'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../lib/api/users/user')

describe('Integrations tests for login', () => {
  let serverAuth
  let urlAuth
  let urlLogin

  beforeAll(async (done) => {
    serverAuth = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handlerAuth)
    )
    urlAuth = await listen(serverAuth)
    urlLogin = urlAuth + '/api/auth/login'
    done()
  })

  afterAll((done) => {
    serverAuth.close(done)
  })

  describe('Login', () => {
    const newUser = {
      username: 'emilio',
      email: 'email@email.com',
      password: 'test123123',
    }

    afterEach(() => {
      findUser.mockClear()
    })

    test('should not allow to login if user does not exist', async () => {
      findUser.mockReturnValueOnce(Promise.resolve(null))

      const response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'testtest',
        }),
      })

      expect(response.status).toBe(401)
      const jsonResult = await response.json()

      expect(jsonResult).toMatchObject({
        error: 'User not found or invalid credentials',
      })
    })

    test('Should return 200 for a valid user', async () => {
      findUser.mockReturnValueOnce(Promise.resolve(newUser))

      const response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
        }),
      })

      expect(response.status).toBe(200)
      const jsonResult = await response.json()

      expect(jsonResult).toMatchObject({
        done: true,
      })
    })

    test('Should not work for a blocked user', async () => {
      findUser.mockReturnValueOnce(Promise.resolve({
        ...newUser,
        blocked: true
      }))

      const response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
        }),
      })

      expect(response.status).toBe(401)
      const jsonResult = await response.json()

      expect(jsonResult).toMatchObject({
        error: 'User blocked',
      })
    })
  })
})
