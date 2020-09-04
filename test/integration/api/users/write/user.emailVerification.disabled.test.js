import { findUserWithPassword } from '../../../../../lib/api/entities/users'
import handler from '../../../../../pages/api/auth/[...action]'
import { onUserAdded } from '../../../../../lib/api/hooks/user.hooks'
import request from '../../requestHandler'
import { sendVerifyEmail } from '../../../../../lib/email'

jest.mock('../../../../../lib/email')
jest.mock('../../../../../lib/api/entities/users')
jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    user: {
      emailVerification: false,
      roles: [{ label : 'user', value: 'USER'}],
      newUserRoles: ['USER']
    },
  }),
}))

const newUser = {
  username: 'emilio',
  email: 'email@email.com',
  password: 'test123123',
}

describe('Integration tests for email verification with emailVerification disabled', () => {

  afterEach(() => {
    findUserWithPassword.mockReset()
  })

  test('Login Should return 200 for a non verified user when email verification is disabled', async () => {
    findUserWithPassword.mockReturnValueOnce(
      Promise.resolve({
        ...newUser,
        emailVerified: false,
      })
    )

    const res = await request(handler, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: '/api/auth/login',
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

  test('send email for verification should NOT be called after a user registered', () => {
    onUserAdded(newUser)
    expect(sendVerifyEmail).not.toHaveBeenCalled()
  })
})
