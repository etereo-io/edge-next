import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { findOneUser } from '../../../../../lib/api/users/user'
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
  }),
}))

const demoUser = {
  username: 'demo',
  email: 'demo@demo.com',
  id: '1',
  roles: ['USER'],
  email: 'email@email.com',
  profile: {
    displayName: 'A test user',
    picture: '',
  },
}

describe('Integrations tests for user read', () => {
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
      getPermissions.mockClear()
      getSession.mockClear()
    })

    test('a PUBLIC user should be able to read a profile', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'userId')
      urlToBeUsed.searchParams.append('slug', 'anotherparameter') // We need to add 2 parameters so the api resolver detects slug as an array

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'], 
        'user.admin': ['ADMIN']
      })

      // Current user is PUBLIC
      getSession.mockReturnValue(null)

      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(200)

      expect(jsonResult).toMatchObject({
        username: demoUser.username,
        profile: demoUser.profile,
      })

      expect(findOneUser).toHaveBeenCalledWith({
        id: 'userId'
      })
    })


    test('a PUBLIC user should not be able to read "me"', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'me')
      urlToBeUsed.searchParams.append('slug', 'anotherparameter') // We need to add 2 parameters so the api resolver detects slug as an array

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      expect(response.status).toBe(404)

      expect(findOneUser).not.toHaveBeenCalled()
    })

    test('should return 401 if the access is restricted to logged in users', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'me')
      urlToBeUsed.searchParams.append('slug', 'anotherparameter') // We need to add 2 parameters so the api resolver detects slug as an array

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['USER'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      expect(response.status).toBe(401)

      expect(findOneUser).not.toHaveBeenCalled()
    })

    test('a logged user should be able to read "me"', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'me')
      urlToBeUsed.searchParams.append('slug', 'anotherparameter') // We need to add 2 parameters so the api resolver detects slug as an array

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is USER
      getSession.mockReturnValue({
        id: 'userId',
        roles: ['USER']
      })

      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      const jsonResult = await response.json()
      console.log(jsonResult)
      expect(response.status).toBe(200)

      expect(findOneUser).toHaveBeenCalledWith({
        id: 'userId'
      })
    })


    test('it should be possible to search by @username', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', '@username')
      urlToBeUsed.searchParams.append('slug', 'anotherparameter') // We need to add 2 parameters so the api resolver detects slug as an array

      // Mock permissions
      getPermissions.mockReturnValue({
        'user.read': ['PUBLIC'],
      })

      // Current user is PUBLIC
      getSession.mockReturnValue()

      // The user it finds
      findOneUser.mockReturnValue(Promise.resolve(demoUser))

      const response = await fetch(urlToBeUsed.href, {
        method: 'GET'
      })

      
      expect(response.status).toBe(200)

      expect(findOneUser).toHaveBeenCalledWith({
        username: 'username'
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
