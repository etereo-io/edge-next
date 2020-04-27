// TEST SIGN UP


// Test already used email

// Test already used username

// Test that signup returns cookie

// Test that login is possible after signup

// See discussion https://github.com/zeit/next.js/discussions/11784
// See example

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../lib/api/auth/iron'
import handler from '../../../../pages/api/users'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../lib/api/auth/iron')
jest.mock('../../../../lib/permissions/get-permissions')

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

  test('Should return 400 if required fields are missing (username, email, password)', async () => {
    
    getPermissions.mockReturnValueOnce({
      'user.create': ['public'],
    })

    getSession.mockReturnValueOnce({
      roles: ['public']
    })

    const newUser = {
      username: '',
      email: '',
      password: ''
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
      error: 'Invalid user: Username is required, Username minimum length is 3, Email is required, password is required, password minimum length is 3"'
    })
  })

  test('Should return 400 if required fields are missing (email, password)', async () => {
    
    getPermissions.mockReturnValueOnce({
      'user.create': ['public'],
    })

    getSession.mockReturnValueOnce({
      roles: ['public']
    })

    const newUser = {
      username: 'emilio',
      email: '',
      password: ''
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
      error: 'Missing required fields: email, password'
    })
  })

  
})
