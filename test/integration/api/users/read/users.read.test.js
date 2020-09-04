import {
  findOneUser,
} from '../../../../../lib/api/entities/users'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/users/[...slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/users')

jest.mock('../../../../../edge.config', () => ({
  __esModule: true,
  getConfig: jest.fn().mockReturnValue({
    title: 'A test',
    description: 'A test',
    user: {
      roles: [{
        label: 'user',
        value: 'USER'
      }],
      newUserRoles: ['USER']
    }
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
  tokens: [{
    github: 'abc'
  }],
  profile: {
    displayName: 'A test user',
    picture: {},
  },
}

describe('Integrations tests for user read', () => {

  describe('User reading', () => {

    beforeEach(() => {
      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))
    })

    afterEach(() => {
      findOneUser.mockReset()
      getPermissions.mockReset()
      getSession.mockReset()
    })

    test('a PUBLIC user should be able to read a profile', async () => {

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue(null)

    
      const params = {
        slug: ['userId', 'e']
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,

      });

      expect(res.statusCode).toBe(200)

      expect(res.body).toMatchObject({
        username: demoUser.username,
        profile: demoUser.profile,
      })

      // Private fields
      expect(res.body.email).toBeUndefined()
      expect(res.body.hash).toBeUndefined()
      expect(res.body.salt).toBeUndefined()
      expect(res.body.facebook).toBeUndefined()
      expect(res.body.github).toBeUndefined()
      expect(res.body.tokens).toBeUndefined()

      expect(findOneUser).toHaveBeenCalledWith({
        id: 'userId',
      })
    })

    test('a PUBLIC user should not be able to read "me"', async () => {

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      const params = {
        slug: ['me', 'a'],
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,
        
      });
      expect(res.statusCode).toBe(404)

      expect(findOneUser).not.toHaveBeenCalled()
    })

    test('should return 401 if the access is restricted to logged in users', async () => {

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['USER'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()


      const params = {
        slug: ['me', 'a'],
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,
        
      });
      expect(res.statusCode).toBe(401)

      expect(findOneUser).not.toHaveBeenCalled()
    })

    test('a logged user should be able to read "me"', async () => {

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is USER
      getSession.mockReturnValue({
        id: '1',
        roles: ['USER'],
      })


      const params = {
        slug: ['me', 'a'],
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,
        
      });
      expect(res.statusCode).toBe(200)

      expect(findOneUser).toHaveBeenCalledWith({
        id: '1',
      })

      // Private fields
      expect(res.body.email).not.toBeUndefined()
      expect(res.body.hash).not.toBeUndefined()
      expect(res.body.salt).not.toBeUndefined()
      expect(res.body.facebook).not.toBeUndefined()
      expect(res.body.github).not.toBeUndefined()
      expect(res.body.tokens).not.toBeUndefined()
    })

    test('it should be possible to search by @username', async () => {


      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      const params = {
        slug: ['@username', 'a'],
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,
        
      });
      expect(res.statusCode).toBe(200)

      expect(findOneUser).toHaveBeenCalledWith({
        username: 'username',
      })

      // Private fields
      expect(res.body.email).toBeUndefined()
      expect(res.body.hash).toBeUndefined()
      expect(res.body.salt).toBeUndefined()
      expect(res.body.facebook).toBeUndefined()
      expect(res.body.github).toBeUndefined()
      expect(res.body.tokens).toBeUndefined()
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

      const params = {
        slug: ['@username', 'a'],
      }

      const res = await request(handler, {
        method: 'GET',
        query: params,
        
      });
      expect(res.statusCode).toBe(200)

      expect(findOneUser).toHaveBeenCalledWith({
        username: 'username',
      })

      // Private fields
      expect(res.body.email).not.toBeUndefined()
      expect(res.body.hash).not.toBeUndefined()
      expect(res.body.salt).not.toBeUndefined()
      expect(res.body.facebook).not.toBeUndefined()
      expect(res.body.github).not.toBeUndefined()
      expect(res.body.tokens).not.toBeUndefined()
    })
  })
})