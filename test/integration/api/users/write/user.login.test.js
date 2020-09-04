import { findUserWithPassword } from '../../../../../lib/api/entities/users'
import handler from '../../../../../pages/api/auth/[...action]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/entities/users')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    user: {
      emailVerification: true,
      roles: [{ label : 'user', value: 'USER'}],
      newUserRoles: ['USER'],
    },
  }),
}))

describe('Integrations tests for login', () => {

  describe('Login', () => {
    const newUser = {
      username: 'emilio',
      email: 'email@email.com',
      password: 'test123123',
      emailVerified: true,
    }

    afterEach(() => {
      findUserWithPassword.mockReset()
    })

    test('should not allow to login if user does not exist', async () => {
      findUserWithPassword.mockReturnValueOnce(Promise.resolve(null))
      const res = await request(handler, {
        method: 'POST',
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          email: 'test@test.com',
          password: 'testtest',
        },
      });
      
      expect(res.statusCode).toBe(401)

      expect(res.body).toMatchObject({
        error: 'User not found or invalid credentials',
      })
    })

    test('Should return 200 for a valid user', async () => {
      findUserWithPassword.mockReturnValueOnce(Promise.resolve(newUser))

  
      const res = await request(handler, {
        method: 'POST',
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          email: newUser.email,
          password: newUser.password,
        },
      });

      expect(res.statusCode).toBe(200)

      expect(res.body).toMatchObject({
        done: true,
      })
    })

    test('Should not work for a blocked user', async () => {
      findUserWithPassword.mockReturnValueOnce(
        Promise.resolve({
          ...newUser,
          blocked: true,
        })
      )

      const res = await request(handler, {
        method: 'POST',
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          email: newUser.email,
          password: newUser.password,
        },
      });


      expect(res.statusCode).toBe(401)

      expect(res.body).toMatchObject({
        error: 'User blocked',
      })
    })
  })
})
