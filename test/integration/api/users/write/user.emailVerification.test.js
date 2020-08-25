import {
  findOneUser,
  findUserWithPassword,
  updateOneUser,
} from '../../../../../lib/api/entities/users/user'

import handler from '../../../../../pages/api/auth/[...action]'
import { onUserAdded } from '../../../../../lib/api/hooks/user.hooks'
import request from '../../requestHandler'
import { sendVerifyEmail } from '../../../../../lib/email'

jest.mock('../../../../../lib/email')
jest.mock('../../../../../lib/api/entities/users/user')
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

const newUser = {
  username: 'emilio',
  email: 'email@email.com',
  password: 'test123123',
}

describe('Integration tests for email verification with emailVerification enabled', () => {
 
  afterEach(() => {
    findOneUser.mockReset()
    findUserWithPassword.mockReset()
    updateOneUser.mockReset()
  })

  test('Should return 401 for login a user with unverified email if configuration for verification is enabled', async () => {
    findUserWithPassword.mockReturnValueOnce(
      Promise.resolve({
        ...newUser,
        tokens: [],
        emailVerified: false,
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
      error: 'Email not verified',
    })
  })

  test('Should return 200 for login a user with unverified email if user has tokens from an OAUTH login', async () => {
    findUserWithPassword.mockReturnValueOnce(
      Promise.resolve({
        ...newUser,
        tokens: [{
          something: 'something'
        }],
        emailVerified: false,
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

    expect(res.statusCode).toBe(200)
  })

  test('Should return 200 for login a user with verified email if configuration for verification is enabled', async () => {
    findUserWithPassword.mockReturnValueOnce(
      Promise.resolve({
        ...newUser,
        emailVerified: true,
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

    expect(res.statusCode).toBe(200)
  })

  test('Calling to email verification should change the status to verified', async () => {
    findOneUser.mockReturnValue(
      Promise.resolve({
        ...newUser,
        id: 'theid',
        emailVerificationToken: '1234',
      })
    )

    
    const res = await request(handler, {
      method: 'GET',
      query: {
        email: 'test@test.com',
        token: '1234'
      },
      url: '/api/auth/verify',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: {
        email: newUser.email,
        password: newUser.password,
      },
    });



    expect(res.statusCode).toBe(200)

    expect(updateOneUser).toHaveBeenCalledWith('theid', {
      emailVerified: true,
      emailVerificationToken: null,
    })
  })

  test('send email for verification should be called after a user registered', () => {
    onUserAdded(newUser)
    expect(sendVerifyEmail).toHaveBeenCalled()
  })
})
