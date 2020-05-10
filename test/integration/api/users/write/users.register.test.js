// TEST SIGN UP

// Test already used email

// Test already used username

// Test that signup returns cookie

// Test that login is possible after signup

// See discussion https://github.com/zeit/next.js/discussions/11784
// See example

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/users'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')

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
        github: false,
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

describe('Integrations tests for users creation endpoint', () => {
  let server
  let url

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
  })

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handler)
    )
    url = await listen(server)

    done()
  })

  afterAll((done) => {
    server.close(done)
  })

  describe('PUBLIC users can register', () => {
    beforeEach(() => {
      getPermissions.mockReturnValueOnce({
        'user.create': ['PUBLIC'],
      })

      getSession.mockReturnValueOnce({
        roles: ['PUBLIC'],
      })
    })
    test('Should return 400 if required fields are missing (username, email, password)', async () => {
      const newUser = {
        username: '',
        email: '',
        password: '',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error:
          'Invalid user: Username is required, Username minimum length is 3, Email is required, password is required, password minimum length is 3',
      })
    })

    test('Should return 400 if required fields are missing (email, password)', async () => {
      const newUser = {
        username: 'emilio',
        email: '',
        password: '',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error:
          'Invalid user: Email is required, password is required, password minimum length is 3',
      })
    })

    test('Should return 400 if password is too short', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'Invalid user: password minimum length is 3',
      })
    })

    test('Should return 400 if username is too short', async () => {
      const newUser = {
        username: 'me',
        email: 'email@email.com',
        password: 'test123123',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'Invalid user: Username minimum length is 3',
      })
    })

    test('Should return 400 if email is invalid', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@.com',
        password: 'test123123',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'Invalid user: email must be a valid email',
      })
    })

    test('Should return 200 for a valid user', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test123123',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        emailVerified: false,
        emailVerificationToken: expect.any(String),
      })
    })

    test('Should return 400 for a pre-existing email', async () => {
      const newUser = {
        username: 'antoheruser',
        email: 'email@email.com',
        password: 'test123123',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'Email already taken',
      })
    })

    test('Should return 400 for a pre-existing username', async () => {
      const newUser = {
        username: 'emilio',
        email: 'anotheremail@email.com',
        password: 'test123123',
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(400)
      expect(jsonResult).toMatchObject({
        error: 'Username already taken',
      })
    })
  })
})
