import { findUsers } from '../../../../../lib/api/entities/users'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/users'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/users')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    user : {
      permissions: {
        
      },

      roles: [{ label : 'user', value: 'USER'}],
      newUserRoles: ['USER'],
    },
  }),
}))

const demoUser = {
  username: 'demo',
  email: 'demo@demo.com',
  id: '1',
  roles: ['USER'],
  hash: 'asdadasd',
  salt: 'asdasdsa',
  email: 'email@email.com',
  facebook: 'abc',
  github: 'abc',
  tokens: [{ github: 'abc' }],
  profile: {
    displayName: 'A test user',
    picture: {},
  },
}

describe('Integrations tests for user list read', () => {
 
  describe('User reading', () => {
    afterEach(() => {
      findUsers.mockReset()
      getPermissions.mockReset()
      getSession.mockReset()
    })

    test('a PUBLIC user should be able to read user lilst', async () => {
        
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue(null)

      // The user it finds
      findUsers.mockReturnValue(
        Promise.resolve({ results: [demoUser], from: 0, to: 15 })
      )

      const res = await request(handler, {
        method: 'GET',
      });

      expect(res.statusCode).toBe(200)

      expect(res.body).toMatchObject({
        results: [
          {
            username: demoUser.username,
            profile: demoUser.profile,
          },
        ],
        from: 0,
        to: 15,
      })

      // Private fields
      const user = res.body.results[0]
      
      expect(user.email).toBeUndefined()
      expect(user.hash).toBeUndefined()
      expect(user.salt).toBeUndefined()
      expect(user.facebook).toBeUndefined()
      expect(user.github).toBeUndefined()
      expect(user.tokens).toBeUndefined()
    })

    test('should return 401 if the access is restricted to logged in users', async () => {
        

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['USER'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      // The user it finds
      findUsers.mockReturnValue(
        Promise.resolve({ results: [demoUser], from: 0, to: 15 })
      )

      const res = await request(handler, {
        method: 'GET',
      });

      expect(res.statusCode).toBe(401)

      expect(findUsers).not.toHaveBeenCalled()
    })

    test('an admin should see private fields', async () => {
        

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue({
        roles: ['ADMIN'],
        id: 'abc',
      })

      // The user it finds
      findUsers.mockReturnValue(
        Promise.resolve({ results: [demoUser], from: 0, to: 15 })
      )

      const res = await request(handler, {
        method: 'GET',
      });

      expect(res.statusCode).toBe(200)
      // Private fields
      const user = res.body.results[0]
      
      expect(user.email).not.toBeUndefined()
      expect(user.hash).not.toBeUndefined()
      expect(user.salt).not.toBeUndefined()
      expect(user.facebook).not.toBeUndefined()
      expect(user.github).not.toBeUndefined()
      expect(user.tokens).not.toBeUndefined()
    })
  })
})
