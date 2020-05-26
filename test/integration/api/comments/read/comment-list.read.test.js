import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { findComments } from '../../../../../lib/api/entities/comments/comments'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/comments'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/comments/comments')

jest.mock('../../../../../edge.config', () => {
 
  const mockPostContentType = {
    title: 'Post',

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
      }
    ],
  }

  const mockProductContentType = {
    title: 'Product',

    slug: 'product',

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
      enabled: false,
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
      }
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
        types: [mockPostContentType, mockProductContentType],
        initialContent: [],
      },
    }),
  }
})

// Find comments by contentType + contentId, 
// find comments by author
// find comments by contentType


describe('Integrations tests for comment list read endpoint', () => {
  let server
  let url
  
  beforeEach(() => {
    findComments.mockReturnValue(Promise.resolve({
      from: 0,
      limit: 15, 
      results: []
    }))
  })

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
    findComments.mockClear()
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


  test('Should return 405 if contentType does not exist', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'something' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).not.toHaveBeenCalled()

    expect(response.status).toBe(405)
  })

  test('Should return 401 if contentType does not allow comments', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'product' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).not.toHaveBeenCalled()

    expect(response.status).toBe(401)
  })

  test('Should return 200 if contentType exists', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post'
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

  })

  test('Should allow contentId option', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 'example' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    const jsonResult = await response.json()

    expect(response.status).toBe(200)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      contentId: 'example'
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

  })

  test('Should allow conversationId option', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', conversationId: 'conversationId' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      conversationId: 'conversationId'
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

    expect(response.status).toBe(200)
  })

  test('Should allow conversationId option to false if we want to ellicit null conversationid', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', conversationId: 'false' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      conversationId: null
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

    expect(response.status).toBe(200)
  })


  test('Should allow author option', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', author: 'author' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      author: 'author'
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

    expect(response.status).toBe(200)
  })

  test('Should allow empty contentType, meaning that it will call to all the available contents', async () => {
    const urlToBeUsed = new URL(url)
    const params = { author: 'author' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)

    expect(findComments).toHaveBeenCalledWith({
      contentType: { '$in': ['post', 'product']},
      author: 'author'
    }, {from: undefined, limit: undefined, sortBy: undefined, sortOrder: undefined})

    expect(response.status).toBe(200)
  })

  test('Should accept pagination options exist', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', from: 10, limit: 20 }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )
    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })
    
    const response = await fetch(urlToBeUsed.href)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post'
    }, {from: 10, limit: 20, sortBy: undefined, sortOrder: undefined})

    expect(response.status).toBe(200)
  })

  test('Should return 401 if user is not allowed', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 'example-post-0' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['USER'],
    })

    const response = await fetch(urlToBeUsed.href)
    const jsonResult = await response.json()
    
    expect(response.status).toBe(401)
  })

  test('Should return pagination list results', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href)
    const jsonResult = await response.json()

    expect(response.status).toBe(200)


    expect(jsonResult).toMatchObject({
      results: [],
      from: 0,
      limit: 15,
    })
  })

 
})
