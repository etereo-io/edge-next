import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/users'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    // Users configuration
    user: {
      // Require email verification
      emailVerification: true,

      roles: [{ label : 'user', value: 'USER'}],
      newUserRoles: ['USER'],

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
            minlength: 20,
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
          email: 'admin@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: ['ADMIN', 'USER'],
          id: '1',
          password: 'admin',
          profile: {
            picture: {
              path: '/static/demo-images/default-avatar.jpg',
            },
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
            picture: { path: null },
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
            picture: { path: null },
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
            picture: { path: null },
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
 

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })


  describe('PUBLIC users can register', () => {
    beforeEach(() => {
      getPermissions.mockReturnValue({
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

      const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });


      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error:
          'Invalid user: Username is required, Username minimum length is 3, Email is required, password is required, password minimum length is 6',
      })
    })

    test('Should return 400 if required fields are missing (email, password)', async () => {
      const newUser = {
        username: 'emilio',
        email: '',
        password: '',
      }

      const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });


      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error:
          'Invalid user: Email is required, password is required, password minimum length is 6',
      })
    })

    test('Should return 400 if password is too short', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test',
      }

     const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Invalid user: password minimum length is 6',
      })
    })

    test('Should return 400 if username is too short', async () => {
      const newUser = {
        username: 'me',
        email: 'email@email.com',
        password: 'test123123',
      }

     const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Invalid user: Username minimum length is 3',
      })
    })

    test('Should return 400 if email is invalid', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@.com',
        password: 'test123123',
      }

     const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Invalid user: email must be a valid email',
      })
    })

    test('Should return 200 for a valid user', async () => {
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test123123',
      }

      const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });
      // console.log('COMPLETED', res)
      expect(res.statusCode).toBe(200)

      expect(res.body).toMatchObject({
        id: expect.any(String),
        metadata: expect.any(Object),
        profile: {
          description: null,
          gender: null
        },
        username: 'emilio'
      })
    })

    test('Should return 400 for a pre-existing email', async () => {
      const newUser = {
        username: 'antoheruser',
        email: 'email@email.com',
        password: 'test123123',
      }

     const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Email already taken',
      })
    })

    test('Should return 400 for a pre-existing username', async () => {
      const newUser = {
        username: 'emilio',
        email: 'anotheremail@email.com',
        password: 'test123123',
      }

     const res = await request(handler, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUser
      });

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Username already taken',
      })
    })
  })
})
