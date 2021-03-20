import {
  findOneUser,
  updateOneUser,
} from '../../../../../lib/api/entities/users'

import { deleteFile } from '../../../../../lib/api/storage'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/users/[...slug]'
import request from '../../requestHandler'
import { sendVerifyEmail } from '../../../../../lib/email'

jest.mock('../../../../../lib/email')
jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/users')
jest.mock('../../../../../lib/api/storage')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    // Users configuration
    user: {
      // Require email verification
      emailVerification: true,
      roles: [{ label: 'user', value: 'USER' }],
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
            name: 'images',
            type: 'img',
            label: 'images',
            multiple: true,
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
          {
            name: 'cypherField',
            label: 'cypherField',
            type: 'text',
            cypher: {
              enabled: true,
              read: ['USER1'],
            },
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
            displayName: 'The admin',
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
            picture: {
              path: null,
            },
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
            picture: {
              path: null,
            },
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
            picture: {
              path: null,
            },
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

describe('Integrations tests for user edition', () => {
  describe('User edition', () => {
    afterEach(() => {
      findOneUser.mockReset()
      updateOneUser.mockReset()
      getPermissions.mockReset()
      getSession.mockReset()
      sendVerifyEmail.mockReset()
    })

    test('a PUBLIC user should not be able to edit a profile', async () => {
      const params = { slug: ['1'] }

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValueOnce()

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toMatchObject({
        error: 'User not authorized to perform operation on user 1',
      })
    })

    test('an authorized user should be able to edit its own profile', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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
          profile: {},
        })
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const params = {
        slug: ['1', 'profile'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        updated: true,
      })
    })

    test('Should notify by email when the email is edited', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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

      const params = {
        slug: ['1', 'email'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        updated: true,
      })

      expect(sendVerifyEmail).toHaveBeenCalled()
    })

    test('Should return error if editing email, the email already exists', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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

      const params = {
        slug: ['1', 'email'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'email already exists',
      })

      expect(sendVerifyEmail).not.toHaveBeenCalled()
    })

    test('Should return error if editing username, the username already exists', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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

      // When we check if the username already exists
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@test.com',
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

      const params = {
        slug: ['1', 'username'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Username already exists',
      })
      expect(updateOneUser).not.toHaveBeenCalled()
    })

    test('Should allow editing username, if the username does not exists', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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

      // When we check if the username already exists
      findOneUser.mockReturnValueOnce(
        Promise.resolve(null)
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        email: 'test@test.com',
        description: 'Wea body test',
      }

      const params = {
        slug: ['1', 'username'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(200)
      expect(updateOneUser).toHaveBeenCalled()
    })


    test('Should allow editing roles, if the current user is an admin', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      // Find one user returns the data
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@t.com',
          password: '12345678',
          username: 'test',
          profile: null,
          roles: ['A', 'B']
        })
      )

      // When we check if the username already exists
      findOneUser.mockReturnValueOnce(
        Promise.resolve(null)
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        roles: ['B', 'C']
      }

      const params = {
        slug: ['1', 'roles'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(200)
      expect(updateOneUser).toHaveBeenCalled()
    })

    test('Should not allow editing roles, if the current user is not an admin', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
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
          id: 1,
          profile: null,
          roles: ['A', 'B']
        })
      )

      // When we check if the username already exists
      findOneUser.mockReturnValueOnce(
        Promise.resolve(null)
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newUserData = {
        roles: ['B', 'C']
      }

      const params = {
        slug: ['1', 'roles'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })

      expect(res.statusCode).toBe(401)
      expect(updateOneUser).not.toHaveBeenCalled()
    })
    /* 
      TODO: 
      - test that an ADMIN can edit other user
      - test that profile image uploading works
    */
  })

  describe('Files', () => {
    it('should call the delete file for an update removing a file', async () => {
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.update': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      // Current user is logged
      getSession.mockReturnValue({
        roles: ['USER'],
        id: '1',
      })

      // Find one user returns the data
      findOneUser.mockReturnValueOnce(
        Promise.resolve({
          email: 'test@t.com',
          password: '12345678',
          username: 'test',
          profile: {
            images: [
              {
                path: 'abc.test',
              },
            ],
          },
        })
      )

      updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

      const newData = {
        images: [],
      }

      const params = {
        slug: ['1', 'profile'],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      expect(res.statusCode).toBe(200)

      expect(deleteFile).toHaveBeenCalledWith('abc.test')
    })
  })

  test('Should save cyphered data#1', async () => {
    getPermissions.mockReturnValue({
      'user.profile.fields.cypherField.cypher': ['USER1'],
      'user.update': ['USER1'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
      id: '1',
    })

    // Find one user returns the data
    findOneUser.mockReturnValueOnce(
      Promise.resolve({
        id: '1',
        email: 'test@t.com',
        password: '12345678',
        username: 'test',
        profile: {},
      })
    )

    updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

    const newUserData = {
      description: 'Wea body test',
      cypherField: 'cypherField#1',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: { slug: ['1', 'profile'] },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    })

    expect(updateOneUser).toBeCalledWith('1', {
      profile: {
        description: 'Wea body test',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#1'),
      },
    })
    expect(res.statusCode).toBe(200)
  })

  test('Should save cyphered data#2', async () => {
    getPermissions.mockReturnValue({
      'user.profile.fields.cypherField.cypher': ['USER1'],
      'user.update': ['USER1'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
      id: '1',
    })

    // Find one user returns the data
    findOneUser.mockReturnValueOnce(
      Promise.resolve({
        id: '1',
        email: 'test@t.com',
        password: '12345678',
        username: 'test',
        profile: {},
      })
    )

    updateOneUser.mockReturnValueOnce(Promise.resolve({ id: 1 }))

    const newUserData = {
      description: 'Wea body test',
      cypherField: 'cypherField#2',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: { slug: ['1', 'profile'] },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    })

    expect(updateOneUser).toBeCalledWith('1', {
      profile: {
        description: 'Wea body test',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#2'),
      },
    })
    expect(res.statusCode).toBe(200)
  })
})
