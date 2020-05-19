// See discussion https://github.com/zeit/next.js/discussions/11784
// See example

import * as handler from '../../../../../pages/api/content/[type]/[slug]'

import {
  deleteOneContent,
  findOneContent,
} from '../../../../../lib/api/content/content'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { deleteActivity } from '../../../../../lib/api/activity/activity'
import { deleteComment } from '../../../../../lib/api/comments/comments'
import { deleteFile } from '../../../../../lib/api/storage'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/comments/comments')
jest.mock('../../../../../lib/api/activity/activity')
jest.mock('../../../../../lib/api/content/content')

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
        initialContent: [],
      },
    }),
  }
})

describe('Integrations tests for content deletion endpoint', () => {
  let server
  let url

  beforeEach(() => {
    deleteOneContent.mockReturnValue(Promise.resolve())
    deleteActivity.mockReturnValue(Promise.resolve())
    deleteComment.mockReturnValue(Promise.resolve())
    deleteFile.mockReturnValue(Promise.resolve())
    findOneContent.mockReturnValue(
      Promise.resolve({
        type: 'post',
        id: 'contentid',
        author: 'userId',
        title: 'Example post',
        slug: 'example-post-0',
        image: [
          {
            path: 'abc.test',
          },
        ],
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
      })
    )
  })

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
    findOneContent.mockClear()
    deleteComment.mockClear()
    deleteActivity.mockClear()
    deleteOneContent.mockClear()
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

  describe('Correct delete', () => {
    test('Should delete comments, files and activity if a content is deleted', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      expect(response.status).toBe(200)

      expect(deleteFile).toHaveBeenCalledWith('abc.test')
      expect(deleteComment).toHaveBeenCalledWith({
        contentId: 'contentid',
      })
      expect(deleteActivity).toHaveBeenCalledWith({
        meta: {
          contentId: 'contentid',
        },
      })
      expect(deleteOneContent).toHaveBeenCalledWith('post', {
        id: 'contentid',
      })
    })
  })

  describe('Invalid delete', () => {
    test('Should return 401 when deleting other person content without the content.post.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      const jsonResult = await response.json()

      expect(response.status).toBe(401)
      expect(jsonResult).toMatchObject({
        message: 'User not authorized to perform operation on content post',
      })
    })

    test('Should return 200 when deleting other person content with the content.post.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.delete': ['USER'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      expect(response.status).toBe(200)
    })

    test('Should return 200 when deleting other person content with the content.post.admin permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', slug: 'example-post-0' }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['USER'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      expect(response.status).toBe(200)
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.delete': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href, {
      method: 'DELETE',
    })

    expect(response.status).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    const params = { type: 'post', slug: 'example-post-0' }

    getPermissions.mockReturnValueOnce({
      'content.post.delete': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href, {
      method: 'DELETE',
    })

    expect(response.status).toBe(200)
  })
})
