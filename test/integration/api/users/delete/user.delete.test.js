import * as handler from '../../../../../pages/api/users/[...slug]'

import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '../../../../../lib/api/entities/comments/comments'
import {
  deleteOneContent,
  findOneContent,
} from '../../../../../lib/api/entities/content/content'
import {
  deleteOneUser,
  findOneUser,
} from '../../../../../lib/api/entities/users/user'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import crypto from 'crypto'
import { deleteActivity } from '../../../../../lib/api/entities/activity/activity'
import { deleteFile } from '../../../../../lib/api/storage'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/entities/comments/comments')
jest.mock('../../../../../lib/api/entities/activity/activity')
jest.mock('../../../../../lib/api/entities/content/content')
jest.mock('../../../../../lib/api/entities/users/user')

jest.mock('../../../../../edge.config', () => {
  const mockPostContentType = {
    title: 'post',

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

  const mockProductContentType = {
    title: 'post',

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
        types: [mockPostContentType, mockProductContentType],
      },

      user: {
        profile: {
          fields: [
            {
              label: 'image',
              type: 'img',
              name: 'image',
              multiple: true,
            },
          ],
        },
      },
    }),
  }
})

describe('Integrations tests for user deletion endpoint', () => {
  let server
  let url

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync('thepassword', salt, 1000, 64, 'sha512')
    .toString('hex')

  beforeEach(() => {
    deleteOneContent.mockReturnValue(Promise.resolve())
    deleteActivity.mockReturnValue(Promise.resolve())
    deleteComment.mockReturnValue(Promise.resolve())
    deleteFile.mockReturnValue(Promise.resolve())
    deleteOneUser.mockReturnValue(Promise.resolve())
    findOneContent.mockReturnValue(Promise.resolve()).mockReturnValueOnce(
      Promise.resolve({
        id: 'a content',
        author: 'userId',
        file: [
          {
            path: 'content.file',
          },
        ],
      })
    )

    findOneComment.mockReturnValue(Promise.resolve()).mockReturnValueOnce(
      Promise.resolve({
        id: 'a comment',
        author: 'userId',
        conversationId: null,
      })
    )

    deleteOneComment.mockReturnValue(Promise.resolve())

    findOneUser.mockReturnValue(
      Promise.resolve({
        id: 'userId',
        username: 'abcd',
        profile: {
          picture: {
            source: 'internal',
            path: 'abc.test',
          },
          image: [
            {
              path: 'otherimage.test',
            },
          ],
        },
        hash,
        salt,
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
    deleteOneUser.mockClear()
    findOneUser.mockClear()
    findOneComment.mockClear()
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

  test('should return 401 if the password do not match', async () => {
    const urlToBeUsed = new URL(url)
    urlToBeUsed.searchParams.append('slug', 'userId')
    urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array
    urlToBeUsed.searchParams.append('password', '123')

    getPermissions.mockReturnValueOnce({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'userId',
    })

    const response = await fetch(urlToBeUsed.href, {
      method: 'DELETE',
    })

    expect(response.status).toBe(401)
  })

  describe('Correct delete', () => {
    test('Should delete content, comments, files and activity if a user is deleted', async () => {
      const urlToBeUsed = new URL(url)

      urlToBeUsed.searchParams.append('slug', 'userId')
      urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array
      urlToBeUsed.searchParams.append('password', 'thepassword')

      getPermissions.mockReturnValueOnce({
        'user.delete': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const response = await fetch(urlToBeUsed.href, {
        method: 'DELETE',
      })

      expect(response.status).toBe(200)

      expect(deleteFile).toHaveBeenNthCalledWith(1, 'abc.test')
      expect(deleteFile).toHaveBeenNthCalledWith(2, 'otherimage.test')
      expect(deleteFile).toHaveBeenNthCalledWith(3, 'content.file')

      expect(deleteComment).toHaveBeenCalledWith({
        author: 'userId',
      })
      expect(deleteActivity).toHaveBeenNthCalledWith(1, {
        role: 'user',
        author: 'userId',
      })

      expect(deleteActivity).toHaveBeenNthCalledWith(2, {
        role: 'user',
        meta: {
          contentId: 'a content',
        },
      })
      expect(deleteOneContent).toHaveBeenNthCalledWith(1, 'post', {
        id: 'a content',
      })

      expect(deleteOneComment).toHaveBeenNthCalledWith(1, {
        id: 'a comment',
      })
    })
  })

  describe('Other accounts', () => {
    test('Should return 401 when deleting other person account without the user.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'userId')
      urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array

      getPermissions.mockReturnValueOnce({
        'user.delete': ['ADMIN'],
        'user.admin': ['ADMIN'],
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
        message: 'User not authorized to perform operation on user userId',
      })
    })

    test('Should return 200 when deleting other person account with the user.delete permission', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'userId')
      urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array

      getPermissions.mockReturnValueOnce({
        'user.delete': ['USER'],
        'user.admin': ['ADMIN'],
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

    test('Should return 200 when deleting other person content with the user.admin permission', async () => {
      const urlToBeUsed = new URL(url)
      urlToBeUsed.searchParams.append('slug', 'userId')
      urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array

      getPermissions.mockReturnValueOnce({
        'user.delete': ['ADMIN'],
        'user.admin': ['USER'],
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
    urlToBeUsed.searchParams.append('slug', 'userId')
    urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array

    getPermissions.mockReturnValueOnce({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const response = await fetch(urlToBeUsed.href, {
      method: 'DELETE',
    })

    expect(response.status).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
    const urlToBeUsed = new URL(url)
    urlToBeUsed.searchParams.append('slug', 'userId')
    urlToBeUsed.searchParams.append('slug', 'e') // Random value for API to detect slug as an array

    getPermissions.mockReturnValueOnce({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const response = await fetch(urlToBeUsed.href, {
      method: 'DELETE',
    })

    expect(response.status).toBe(200)
  })
})
