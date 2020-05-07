import { findOneUser, updateOneUser } from '../../../../../lib/api/users/user'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handlerUser from '../../../../../pages/api/users/[...slug]'
import http from 'http'
import listen from 'test-listen'
import { sendVerifyEmail } from '../../../../../lib/email'

jest.mock('../../../../../lib/email')
jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/users/user')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    // Users configuration
    user: {
      // Capture user geolocation and enable geolocation display on the admin dashboard
      captureGeolocation: true,

      // Require email verification
      emailVerification: true,

      providers: {
        instagram: false,
        google: false,
        facebook: true,
      },

      // Fields for the users profiles (in addition to picture and displayName)
      profile: {
        fields: [
          {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            required: false,
            minlength: 60,
            maxlength: 300,
            roles: [],
          },
          {
            name: 'gender',
            type: 'select',
            label: 'gender',
            required: true,
            options: [
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
            ],
          },
        ],
      },

      // Initial users data for testing purposes
      initialUsers: [
        {
          username: 'admin',
          displayname: 'The admin',
          email: 'admin@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: ['ADMIN', 'USER'],
          id: '1',
          password: 'admin',
          profile: {
            picture: '/static/demo-images/default-avatar.jpg',
          },
          metadata: {
            lastLogin: null,
          },
        },
        {
          username: 'user',
          email: 'user@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: ['USER'],
          id: '2',
          password: 'user',
          profile: {
            picture: '',
          },
          metadata: {
            lastLogin: null,
          },
        },
        {
          username: 'blocked',
          email: 'blocked@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: ['USER'],
          id: '3',
          password: 'user',
          profile: {
            picture: '',
          },
          blocked: true,
          metadata: {
            lastLogin: null,
          },
        },
        {
          username: 'notverified',
          email: 'notverified@demo.com',
          emailVerified: false,
          emailVerificationToken: '1234',
          createdAt: Date.now(),
          roles: ['USER'],
          id: '3',
          password: 'user',
          profile: {
            picture: '',
          },
          blocked: true,
          metadata: {
            lastLogin: null,
          },
        },
      ],
    },
  }),
}))

describe('Integrations tests for login', () => {
  let server
  let url

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handlerUser)
    )
    url = await listen(server)

    done()
  })

  afterAll((done) => {
    server.close(done)
  })

  describe('User edition', () => {
    afterEach(() => {
      findOneUser.mockClear()
      updateOneUser.mockClear()
      getPermissions.mockClear()
      getSession.mockClear()
      sendVerifyEmail.mockClear()
    })

    test('a PUBLIC user should not be able to edit a profile', async () => {
      const urlToBeUsed = new URL(url)
      const params = { slug: ['1'] }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      // Mock permissions
      getPermissions.mockReturnValueOnce({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValueOnce()

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(401)
      expect(jsonResult).toMatchObject({
        message: 'User not authorized to user.update,user.admin',
      })
    })

    test('an authorized user should be able to edit its own profile', async () => {
      const urlToBeUsed = new URL(url)

      urlToBeUsed.searchParams.append('slug', '1')
      urlToBeUsed.searchParams.append('slug', 'profile')

      // Mock permissions
      getPermissions.mockReturnValueOnce({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      // Find one user returns the data
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@t.com',
          password: '12345678',
          username: 'test',
          profile: null,
        })
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        updated: true,
      })
    })

    test('Should notify by email when the email is edited', async () => {
      const urlToBeUsed = new URL(url)

      urlToBeUsed.searchParams.append('slug', '1')
      urlToBeUsed.searchParams.append('slug', 'email')

      // Mock permissions
      getPermissions.mockReturnValueOnce({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      // Find one user returns the data
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@t.com',
          password: '12345678',
          username: 'test',
          profile: null,
        })
      )

      // When we check if the email already exists
      findOneUser.mockReturnValueOnce(Promise.resolve(null))

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        updated: true,
      })

      expect(sendVerifyEmail).toHaveBeenCalled()
    })

    test('Should return error if editing email, the email already exists', async () => {
      const urlToBeUsed = new URL(url)

      urlToBeUsed.searchParams.append('slug', '1')
      urlToBeUsed.searchParams.append('slug', 'email')

      // Mock permissions
      getPermissions.mockReturnValueOnce({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      // Find one user returns the data
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@t.com',
          password: '12345678',
          username: 'test',
          profile: null,
        })
      )

      // When we check if the email already exists
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@test.com',
          password: '12345678',
          username: 'test2',
          profile: null,
        })
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'email already exists',
      })

      expect(sendVerifyEmail).not.toHaveBeenCalled()
    })

    /* 
      TODO: 
      - test that a user can not edit another user
      - test that an ADMIN can edit other user
      - test that editing the username only works if that username is not available
      - test that editing an email triggers a e-mail verification hook
      - test that profile image uploading works
      - test that editing an email checks that that email does not exist
    */
  })
})
