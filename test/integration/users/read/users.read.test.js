import { findOneUser, updateOneUser } from '../../../../lib/api/users/user'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../lib/api/auth/iron'
import handlerUser from '../../../../pages/api/users/[...slug]'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../lib/api/auth/iron')
jest.mock('../../../../lib/permissions/get-permissions')
jest.mock('../../../../lib/api/users/user')

const demoUser = {
  username: 'demo',
  email: 'demo@demo.com',
  id: 1,
  roles: ['USER'],
  password: 'xxhshsk--213123-123-1-23',
  profile: {
    displayname: 'A test user',
    img: '',
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
