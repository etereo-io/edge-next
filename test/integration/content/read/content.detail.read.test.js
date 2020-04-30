import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../lib/api/auth/iron'
import handler from '../../../../pages/api/content/[type]/[slug]'
// See discussion https://github.com/zeit/next.js/discussions/11784
// See example
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../lib/api/auth/iron')
jest.mock('../../../../lib/permissions/get-permissions')


describe('Integrations tests for content detail endpoint', () => {
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

  test('Should return 405 if required query string is missing', async () => {
    const response = await fetch(url)
    expect(response.status).toBe(405)
  })

  test('Should return 405 if required query slug is missing', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(405)
  })

  test('Should return content details given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['PUBLIC'],
      'content.post.admin': ['ADMIN'],
    })

    const response = await fetch(urlToBeUsed.href)
    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      title: expect.any(String),
      type: 'post',
      slug: 'example-post-0',
      description: expect.any(String),
      tags: expect.any(Array),
      image: expect.any(String),
      id: expect.anything(),
    })
  })

  test('Should return 200 for a role that is not public', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['PUBLIC'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(401)
  })

  test('Should return 200 if it does have permissions to access for USER', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toBe(200)
  })
})
