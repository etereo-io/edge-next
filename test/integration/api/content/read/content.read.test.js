import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]'
// See discussion https://github.com/zeit/next.js/discussions/11784
// See example
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = []

  for (var i = 0; i < 100; i++) {
    const userId = Math.round(Math.random() * 10)

    mockInitialPosts.push({
      type: 'post',
      id: i,
      author: userId,
      title: 'Example post',
      slug: 'example-post-' + i,
      image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      description: 'This is an example description',
      draft: Math.random() > 0.5 ? true : false,
      tags: [
        {
          slug: 'software',
          label: 'SOFTWARE',
        },
        {
          slug: 'ai',
          label: 'AI',
        },
      ],
    })
  }

  const mockPostContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },

    slug: 'post',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['PUBLIC'],
      create: ['ADMIN', 'USER'],
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },

    publishing: {
      draftMode: true,
    },

    comments: {
      enabled: true,
      permissions: {
        read: ['PUBLIC'],
        create: ['USER', 'ADMIN'],
        update: ['ADMIN'],
        delete: ['ADMIN'],
        admin: ['ADMIN'],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        title: true,
        placeholder: 'Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
      },
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
      },
      {
        name: 'file',
        type: 'file',
        label: 'File',
        placeholder: 'File',
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags',
      },
    ],
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',
      // Content configuration
      content: {
        // Different content types defined
        types: [mockPostContentType],
        initialContent: mockInitialPosts,
      },
    }),
  }
})

describe('Integrations tests for content endpoint', () => {
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

  test('Should return content details given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

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
      results: expect.any(Array),
      from: expect.any(Number),
      limit: expect.any(Number),
    })
  })

  test('Should return 200 for a role that is not public', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

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
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

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
    const params = { type: 'post' }

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

  describe('Pagination', () => {
    test('Should return from 1 and elements from 15 to 29', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 15, limit: 15 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        results: expect.any(Array),
        from: expect.any(String),
        limit: expect.any(String),
      })

      expect(jsonResult.from).toEqual('15')
      expect(jsonResult.limit).toEqual('15')
      expect(jsonResult.results[0].id).toEqual(15)
      expect(jsonResult.results[jsonResult.results.length - 1].id).toEqual(29)
    })

    test('Should return from 2 and elements from 40 to 59', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 40, limit: 20 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      expect(jsonResult).toMatchObject({
        results: expect.any(Array),
        from: expect.any(String),
        limit: expect.any(String),
      })

      expect(jsonResult.from).toEqual('40')
      expect(jsonResult.limit).toEqual('20')
      expect(jsonResult.results[0].id).toEqual(40)
      expect(jsonResult.results[jsonResult.results.length - 1].id).toEqual(59)
    })
  })

  describe('Filter by author', () => {
    test('Should return only items for that author', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 15, limit: 15, author: 2 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      for (var i = 0; i < jsonResult.results.length; i++) {
        expect(jsonResult.results[i].author).toEqual(2)
      }
    })
  })

  describe('Draft mode', () => {
    test('Should return only items that are not drafts', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 15, limit: 15, author: 2 }

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
      for (var i = 0; i < jsonResult.results.length; i++) {
        expect(jsonResult.results[i].draft).not.toEqual(true)
      }
    })

    test('Should return all the items for admin', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 0, limit: 50, author: 2 }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      let someIsDraft = false
      for (var i = 0; i < jsonResult.results.length; i++) {
        if (jsonResult.results[i].draft) {
          someIsDraft = true
        }
      }

      expect(someIsDraft).toBe(true)
    })

    test('Should all the items for own user', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', from: 0, limit: 150, author: '2' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '2',
      })

      const response = await fetch(urlToBeUsed.href)
      const jsonResult = await response.json()

      expect(response.status).toBe(200)
      let someIsDraft = false
      for (var i = 0; i < jsonResult.results.length; i++) {
        if (jsonResult.results[i].draft) {
          someIsDraft = true
        }
      }

      expect(someIsDraft).toBe(true)
    })
  })
})
