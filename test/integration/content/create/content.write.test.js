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

describe('Integrations tests for content creation endpoint', () => {
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
      'content.post.write': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id'
    })

    const newPost = {
      title: 'test',
      description: 'Wea body test', 
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })

    const jsonResult = await response.json()
    

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      title: newPost.title,
      type: 'post',
      slug: expect.any(String),
      description: newPost.description,
      tags: null,
      image: null,
      author: 'test-id',
      id: expect.anything()
    })
  })

  test('Should return 401 for a role that is public', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.write': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['public']
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const newPost = {
      title: 'test',
      description: 'Wea body test', 
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })

    expect(response.status).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.write': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN']
    })

    Object.keys(params).forEach(key => urlToBeUsed.searchParams.append(key, params[key]))

    const newPost = {
      title: 'test',
      description: 'Wea body test', 
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })

    expect(response.status).toBe(200)
  })

})
