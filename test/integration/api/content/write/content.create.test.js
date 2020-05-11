// See discussion https://github.com/zeit/next.js/discussions/11784
// See example

import { deleteFile, uploadFile } from '../../../../../lib/api/storage'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('formidable', () => ({
  __esModule: true, // this property makes it work
  default: () => {
    return {
      parse: (req, cb) => {
        cb(null, req.body, null)
      }
    }
  }
}))


jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = []

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
        minlength: 8,
        placeholder: 'Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        minlength: 8,
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

describe('Integrations tests for content creation endpoint', () => {
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

  test('Should return 400 if content validation fails', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValueOnce({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })

    const newPost = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    const jsonResult = await response.json()

    expect(response.status).toBe(400)
    expect(jsonResult).toMatchObject({
      error: 'Invalid data: title length is less than 8',
    })
  })

  test('Should return content details given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValueOnce({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })

    const newPost = {
      title: 'test test test test test test ',
      description:
        'test test  test test test test test test test test test test test test test test ',
      tags: [
        {
          label: 'Hello',
          slug: 'hello',
        },
        {
          label: 'World',
          slug: 'world',
        },
      ],
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      title: newPost.title,
      type: 'post',
      slug: expect.any(String),
      description: newPost.description,
      tags: [
        {
          label: 'Hello',
          slug: 'hello',
        },
        {
          label: 'World',
          slug: 'world',
        },
      ],
      image: null,
      author: 'test-id',
      id: expect.anything(),
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newPost = {
      title: 'test',
      description:
        'test test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    getPermissions.mockReturnValueOnce({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newPost = {
      title: 'test test test test test test test test test ',
      description:
        'test test test test test test test test test test test test test test test ',
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toBe(200)
  })

  /*describe('form data', () => {
    test('should allow to send data as a form', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post' }
      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.create': ['PUBLIC'],
      })

      getSession.mockReturnValueOnce({
        roles: ['PUBLIC'],
        id: 'a-user-id',
      })

      const data = new FormData()
      data.append('title', 'the title test  test  test  test  test  test ')
      data.append('description', ' test  test  test  test  test  test  test  test  test  test  test ')
      data.append('tags', JSON.stringify([{ label: 'Hello', slug: 'hello'}, { label: 'World', slug: 'world'}]))

      const response = await fetch(urlToBeUsed.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: data,
      })

      const jsonResult = await response.json()
      console.log(jsonResult)
      expect(response.status).toBe(200)

      expect(jsonResult).toMatchObject({
        title: expect.any(String),
        type: 'post',
        slug: expect.any(String),
        description: expect.any(String),
        tags:  [{
          label: 'Hello',
          slug: 'hello'
        }, {
          label: 'World',
          slug: 'world'
        }],
        image: null,
        author: 'a-user-id',
        id: expect.anything(),
      })
    })
  })*/
})
