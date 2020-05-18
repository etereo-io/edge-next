import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { findUsers } from '../../../../../lib/api/users/user'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handlerUser from '../../../../../pages/api/users'
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
  tokens: [{ github: 'abc'}],
  profile: {
    displayName: 'A test user',
    picture: '',
  },
}

describe('Integrations tests for user list read', () => {
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
      findUsers.mockClear()
      getPermissions.mockClear()
      getSession.mockClear()
    })

    test('a PUBLIC user should be able to read user lilst', async () => {
      const urlToBeUsed = new URL(url)
     
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'], 
        'user.admin': ['ADMIN']
      })

      // Current user is PUBLIC
      getSession.mockReturnValue(null)

      // The user it finds
      findUsers.mockReturnValue(Promise.resolve({ results: [demoUser] , from: 0, to: 15 }))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)

      expect(jsonResult).toMatchObject({
        results: [{
          username: demoUser.username,
          profile: demoUser.profile
        }],
        from: 0,
        to: 15
      })

      // Private fields
      expect(jsonResult.results[0].email).toBeUndefined()
      expect(jsonResult.results[0].hash).toBeUndefined()
      expect(jsonResult.results[0].salt).toBeUndefined()
      expect(jsonResult.results[0].facebook).toBeUndefined()
      expect(jsonResult.results[0].github).toBeUndefined()
      expect(jsonResult.results[0].tokens).toBeUndefined()
    })


    test('should return 401 if the access is restricted to logged in users', async () => {
      const urlToBeUsed = new URL(url)
     
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['USER'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      // The user it finds
      findUsers.mockReturnValue(Promise.resolve({ results: [demoUser] , from: 0, to: 15 }))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      expect(response.status).toBe(401)

      expect(findUsers).not.toHaveBeenCalled()
    })


    test('an admin should see private fields', async () => {
      const urlToBeUsed = new URL(url)
  
      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
        'user.admin': ['ADMIN'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue({
        roles: ['ADMIN'],
        id: 'abc'
      })

      // The user it finds
      findUsers.mockReturnValue(Promise.resolve({ results: [demoUser] , from: 0, to: 15 }))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })
      
      expect(response.status).toBe(200)


      const jsonResult = await response.json()
      // Private fields
      expect(jsonResult.results[0].email).not.toBeUndefined()
      expect(jsonResult.results[0].hash).not.toBeUndefined()
      expect(jsonResult.results[0].salt).not.toBeUndefined()
      expect(jsonResult.results[0].facebook).not.toBeUndefined()
      expect(jsonResult.results[0].github).not.toBeUndefined()
      expect(jsonResult.results[0].tokens).not.toBeUndefined()
    })
  })
})

