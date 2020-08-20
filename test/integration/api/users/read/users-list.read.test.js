import { findUsers } from '../../../../../lib/api/entities/users/user'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/users'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/users/user')

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
      expect(res.body.results[0].email).toBeUndefined()
      expect(res.body.results[0].hash).toBeUndefined()
      expect(res.body.results[0].salt).toBeUndefined()
      expect(res.body.results[0].facebook).toBeUndefined()
      expect(res.body.results[0].github).toBeUndefined()
      expect(res.body.results[0].tokens).toBeUndefined()
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
      expect(res.body.results[0].email).not.toBeUndefined()
      expect(res.body.results[0].hash).not.toBeUndefined()
      expect(res.body.results[0].salt).not.toBeUndefined()
      expect(res.body.results[0].facebook).not.toBeUndefined()
      expect(res.body.results[0].github).not.toBeUndefined()
      expect(res.body.results[0].tokens).not.toBeUndefined()
    })
  })
})
