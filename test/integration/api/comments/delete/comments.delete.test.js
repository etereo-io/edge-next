import * as handler from '../../../../../pages/api/comments/[id]'

import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '../../../../../lib/api/entities/comments/comments'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { deleteActivity } from '../../../../../lib/api/entities/activity/activity'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/comments/comments')
jest.mock('../../../../../lib/api/entities/activity/activity')

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

describe('Integrations tests for comment deletion endpoint', () => {
  let server
  let url

  beforeEach(() => {
    deleteOneComment.mockReturnValue(Promise.resolve())
    deleteActivity.mockReturnValue(Promise.resolve())
    deleteComment.mockReturnValue(Promise.resolve())
    findOneComment.mockReturnValue(
      Promise.resolve({
        author: 'userId',
        createdAt: 1589616086584,
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        message: 'Another test comment',
        conversationId: null,
        slug: '1589616086584-5eb3240d5dd70535e812f402',
        id: '5ebf9dd6e1d3192ac0ae2466',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )
  })

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
    findOneComment.mockClear()
    deleteComment.mockClear()
    deleteActivity.mockClear()
    deleteOneComment.mockClear()
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
    test('Should delete child comments if the comment has no conversationId and activity if a comment is deleted', async () => {
      const urlToBeUsed = new URL(url)
      const params = {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      expect(response.status).toBe(200)

      expect(deleteComment).toHaveBeenCalledWith({
        conversationId: '5ebf9dd6e1d3192ac0ae2466',
      })
      expect(deleteActivity).toHaveBeenCalledWith({
        role: 'user',
        meta: {
          commentId: '5ebf9dd6e1d3192ac0ae2466',
        },
      })

      expect(deleteOneComment).toHaveBeenCalledWith({
        id: '5ebf9dd6e1d3192ac0ae2466',
      })
    })
  })

  describe('Invalid delete', () => {
    test('Should return 401 when deleting other person content without the content.post.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['ADMIN'],
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
        message: 'User not authorized to perform operation on comment post',
      })
    })

    test('Should return 200 when deleting other person content with the content.post.comments.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      const params = {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.comments.delete': ['USER'],
        'content.post.comments.admin': ['ADMIN'],
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
      const params = {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }

      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValueOnce({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['USER'],
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
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }

    getPermissions.mockReturnValueOnce({
      'content.post.comments.delete': ['ADMIN'],
      'content.post.comments.admin': ['ADMIN'],
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
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }

    getPermissions.mockReturnValueOnce({
      'content.post.comments.delete': ['ADMIN'],
      'content.post.comments.admin': ['ADMIN'],
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
