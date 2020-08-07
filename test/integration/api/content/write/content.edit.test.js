import * as handler from '../../../../../pages/api/content/[type]/[slug]'

import { deleteFile, uploadFile } from '../../../../../lib/api/storage'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = [
    {
      type: 'post',
      id: 0,
      author: '1',
      title: 'Example post',
      slug: 'example-post-0',
      image: [],
      description: 'This is an example description',
      draft: false,
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
    },
    {
      type: 'post',
      id: 1,
      author: '2',
      title: 'Example post',
      slug: 'example-post-1',
      image: [
        {
          path: 'https://image.com',
        },
      ],
      description: 'This is an example description',
      draft: true,
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
    },
  ]

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
        placeholder: 'Title',
        minlength: 8,
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

      user : {
        permissions: {
          
        },
  
        roles: [{ label : 'user', value: 'USER'}],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for content edition endpoint', () => {
  let server
  let url

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
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

  describe('Content owner', () => {
    test('Should return 400 if content validation fails', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      const newPost = {
        title: 'tes',
        description:
          'test test  test test test test test test test test test test test test test test ',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
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

    test('Should return new content details given a valid request', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      const newPost = {
        title: 'test test test test test test ',
        description:
          'test test  test test test test test test test test test test test test test test ',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
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
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })
  })

  describe('Other people content', () => {
    test('Should return 401 when updating other person content without the content.post.update permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const newPost = {
        title: 'test test test test test test ',
        description:
          'test test  test test test test test test test test test test test test test test ',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(401)
      expect(jsonResult).toMatchObject({
        error: 'User not authorized to perform operation on content post',
      })
    })

    test('Should return 200 when updating other person content with the content.post.update permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.update': ['USER'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const newPost = {
        title: 'test test test test test test ',
        description:
          'test test  test test test test test test test test test test test test test test ',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
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
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })

    test('Should return 200 when updating other person content with the content.post.admin permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['USER'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const newPost = {
        title: 'test test test test test test ',
        description:
          'test test  test test test test test test test test test test test test test test ',
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
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
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValue({
      'content.post.update': ['ADMIN'],
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValue({
      'content.post.update': ['ADMIN'],
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toBe(200)
  })

  describe('Files', () => {
    it('should call the delete file for an update removing a file', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-1' }

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
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
        image: [],
      }

      const response = await fetch(urlToBeUsed.href, {
        method: 'PUT',
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
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '2',
        id: expect.anything(),
      })

      expect(deleteFile).toHaveBeenCalled()
    })
  })
})
