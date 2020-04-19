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

import handler from '../../../../pages/api/comments/[contentType]/[contentId]'

describe('Integrations tests for comment read endpoint', () => {
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


  test('Should return 405 if contentId is missing', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post' }

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(405)
  })

  test('Should return 401 if user is not allowed', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 'example-post-0' }

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    getPermissions.mockReturnValueOnce({
      'content.post.comments.read': ['USER']
    })

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(401)
  })

  test('Should return empty list if contentId is fake', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 'example-post-0' }

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    getPermissions.mockReturnValueOnce({
      'content.post.comments.read': ['public']
    })

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)

    const jsonResult = await response.json()
    
    expect(jsonResult).toMatchObject({
      results: [],
      from: 0,
      limit: 15
    })
  })

  test('Should return the first 15 items if contentId is OK', async() => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 0 }

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    getPermissions.mockReturnValueOnce({
      'content.post.comments.read': ['public']
    })

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)

    const jsonResult = await response.json()
    
    expect(jsonResult).toMatchObject({
      results: expect.any(Array),
      from: 0,
      limit: 15
    })

    expect(jsonResult.results.length).toEqual(15)
  })




})
