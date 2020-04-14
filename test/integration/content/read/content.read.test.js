// See discussion https://github.com/zeit/next.js/discussions/11784
// See example
import http from "http"
import fetch from "isomorphic-unfetch"
import listen from "test-listen"
import { apiResolver } from "next/dist/next-server/server/api-utils"

jest.mock('../../../../lib/api/auth/iron')
jest.mock('../../../../lib/permissions/get-permissions')
import getPermissions from '../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../lib/api/auth/iron'

import handler from '../../../../pages/api/content/[type]'

describe('Integrations tests for content endpoint', () => {
  let server
  let url

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
  })

  beforeAll(async done => {
    server = http.createServer((req, res) => apiResolver(req, res, undefined, handler))
    url = await listen(server)
    
    done()
  })

  afterAll(done => {
    server.close(done)
  })

  test('Should return 405 if required query string is missing', async () => {
    const response = await fetch(url)
    expect(response.status).toBe(405)
  })

  test('Should return content details given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['public'],
      'content.post.admin': ['ADMIN'],
    })

    const response = await fetch(urlToBeUsed.href)
    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      data: expect.any(Array),
      page: expect.any(Number),
      pageSize: expect.any(Number)
    })
  })

  test('Should return 200 for a role that is not public', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['public'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER']
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(401)
  })

  test('Should return 200 if it does have permissions to access for USER', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER']
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN']
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })


  describe('Pagination', () => {
    test('Should return page 1 and elements from 15 to 30', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', page: 1, pageSize: 15 }
  
      Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))
  
      getPermissions.mockReturnValueOnce({
        'content.post.read': ['public'],
        'content.post.admin': ['ADMIN'],
      })
  
      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()
  
      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        data: expect.any(Array),
        page: expect.any(String),
        pageSize: expect.any(String)
      })

      expect(jsonResult.page).toEqual("1")
      expect(jsonResult.pageSize).toEqual("15")
      expect(jsonResult.data[0].id).toEqual(15)
      expect(jsonResult.data[jsonResult.data.length -1].id).toEqual(30)
    })

    test('Should return page 2 and elements from 40 to 60', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', page: 2, pageSize: 20 }
  
      Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))
  
      getPermissions.mockReturnValueOnce({
        'content.post.read': ['public'],
        'content.post.admin': ['ADMIN'],
      })
  
      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()
  
      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        data: expect.any(Array),
        page: expect.any(String),
        pageSize: expect.any(String)
      })

      expect(jsonResult.page).toEqual("2")
      expect(jsonResult.pageSize).toEqual("20")
      expect(jsonResult.data[0].id).toEqual(40)
      expect(jsonResult.data[jsonResult.data.length -1].id).toEqual(60)
    })
  })

  describe('Filter by author', () => {
    test('Should return only items for that author', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', page: 1, pageSize: 15, author: 2 }
  
      Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))
  
      getPermissions.mockReturnValueOnce({
        'content.post.read': ['public'],
        'content.post.admin': ['ADMIN'],
      })
  
      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()
  
      expect(response.status).toBe(200)
      for(var i = 0; i < jsonResult.data.length; i++) {
        expect(jsonResult.data[i].author).toEqual(2)
      }
    })


  })
})
