import { findOneUser, updateOneUser } from '../../../../../lib/api/users/user'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handlerUser from '../../../../../pages/api/users/[...slug]'
import http from 'http'
import listen from 'test-listen'

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

const demoUser = {
  username: 'demo',
  email: 'demo@demo.com',
  id: 1,
  roles: ['USER'],
  password: 'xxhshsk--213123-123-1-23',
  profile: {
    displayName: 'A test user',
    picture: '',
  },
}

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

  describe('User reading', () => {
    afterEach(() => {
      findOneUser.mockClear()
      updateOneUser.mockClear()
      getPermissions.mockClear()
      getSession.mockClear()
    })

    test('a PUBLIC user should be able to read a profile', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', '1')

      // Mock permissions
      getPermissions.mockReturnValueOnce({
        'user.read': ['PUBLIC'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValueOnce()

      // The user it finds
      findOneUser.mockReturnValueOnce(demoUser)

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        username: demoUser.username,
        profile: demoUser.profile,
      })
    })
  })
})

/* TODO: 
  Test that private data such as password and email is only shared to own user or admin
  Test that anonymous users can request all users
  Test that passwords and settings are not displayed 
  Test that private data is only visible for own user
  Test that private data is visible for admin
*/
