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

  describe('Public users can register', () => {
    beforeEach(() => {
      getPermissions.mockReturnValueOnce({
        'user.create': ['public'],
      })
  
      getSession.mockReturnValueOnce({
        roles: ['public']
      })
  
    })
    test('Should return 400 if required fields are missing (username, email, password)', async () => {
       
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
        error: 'Invalid user: Username is required, Username minimum length is 3, Email is required, password is required, password minimum length is 3'
      })
    })
  
    test('Should return 400 if required fields are missing (email, password)', async () => {
  
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
        error: 'Invalid user: Email is required, password is required, password minimum length is 3'
      })
    })

    test('Should return 400 if password is too short', async () => {
  
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test'
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
        error: 'Invalid user: password minimum length is 3'
      })
    })

    test('Should return 400 if username is too short', async () => {
  
      const newUser = {
        username: 'me',
        email: 'email@email.com',
        password: 'test123123'
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
        error: 'Invalid user: Username minimum length is 3'
      })
    })
    
    test('Should return 400 if email is invalid', async () => {
  
      const newUser = {
        username: 'emilio',
        email: 'email@.com',
        password: 'test123123'
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
        error: 'Invalid user: email must be a valid email'
      })
    })

    test('Should return 200 for a valid user', async () => {
  
      const newUser = {
        username: 'emilio',
        email: 'email@email.com',
        password: 'test123123'
      }
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
  
      const jsonResult = await response.json()
  
      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        created: true
      })
    })

    test('Should return 400 for a pre-existing email', async () => {
  
      const newUser = {
        username: 'antoheruser',
        email: 'email@email.com',
        password: 'test123123'
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
        error: 'Email already taken'
      })
    })

    test('Should return 400 for a pre-existing username', async () => {
  
      const newUser = {
        username: 'emilio',
        email: 'anotheremail@email.com',
        password: 'test123123'
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
        error: 'Username already taken'
      })
    })


  })


  
})
