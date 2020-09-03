import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '../../../../../lib/api/entities/comments'
import {
  deleteOneContent,
  findOneContent,
} from '../../../../../lib/api/entities/content'
import {
  deleteOneUser,
  findOneUser,
} from '../../../../../lib/api/entities/users'

import crypto from 'crypto'
import {
  deleteActivity,
} from '../../../../../lib/api/entities/activity'
import {
  deleteFile,
} from '../../../../../lib/api/storage'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/users/[...slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/entities/comments')
jest.mock('../../../../../lib/api/entities/activity')
jest.mock('../../../../../lib/api/entities/content')
jest.mock('../../../../../lib/api/entities/users')

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

    fields: [{
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

    fields: [{
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
        roles: [{
          label: 'user',
          value: 'USER'
        }],
        newUserRoles: ['USER'],
        profile: {
          fields: [{
            label: 'image',
            type: 'img',
            name: 'image',
            multiple: true,
          }, ],
        },
      },
    }),
  }
})

describe('Integrations tests for user deletion endpoint', () => {


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
        file: [{
          path: 'content.file',
        }, ],
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
          image: [{
            path: 'otherimage.test',
          }, ],
        },
        hash,
        salt,
      })
    )
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    findOneContent.mockReset()
    deleteComment.mockReset()
    deleteActivity.mockReset()
    deleteOneContent.mockReset()
    deleteOneUser.mockReset()
    findOneUser.mockReset()
    findOneComment.mockReset()
    deleteOneComment.mockReset()
  })



  test('should return 401 if the password do not match', async () => {


    getPermissions.mockReturnValue({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'userId',
    })

    const params = {
      slug: ['userId', 'a'],
      password: '123'
    }

    const res = await request(handler, {
      method: 'DELETE',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(401)
  })

  describe('Correct delete', () => {
    test('Should delete content, comments, files and activity if a user is deleted', async () => {


      getPermissions.mockReturnValue({
        'user.delete': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const params = {
        slug: ['userId', 'a'],
        password: 'thepassword'
      }

      const res = await request(handler, {
        method: 'DELETE',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      expect(res.statusCode).toBe(200)

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

      getPermissions.mockReturnValue({
        'user.delete': ['ADMIN'],
        'user.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const params = {
        slug: ['userId', 'a'],
      }

      const res = await request(handler, {
        method: 'DELETE',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });


      expect(res.statusCode).toBe(401)
      expect(res.body).toMatchObject({
        error: 'User not authorized to perform operation on user userId',
      })
    })

    test('Should return 200 when deleting other person account with the user.delete permission', async () => {


      getPermissions.mockReturnValue({
        'user.delete': ['USER'],
        'user.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const params = {
        slug: ['userId', 'a'],
      }

      const res = await request(handler, {
        method: 'DELETE',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      expect(res.statusCode).toBe(200)
    })

    test('Should return 200 when deleting other person content with the user.admin permission', async () => {

      getPermissions.mockReturnValue({
        'user.delete': ['ADMIN'],
        'user.admin': ['USER'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const params = {
        slug: ['userId', 'a'],
      }

      const res = await request(handler, {
        method: 'DELETE',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      expect(res.statusCode).toBe(200)
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {

    getPermissions.mockReturnValue({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const params = {
      slug: ['userId', 'a'],
    }

    const res = await request(handler, {
      method: 'DELETE',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {

    getPermissions.mockReturnValue({
      'user.delete': ['ADMIN'],
      'user.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const params = {
      slug: ['userId', 'a'],
    }

    const res = await request(handler, {
      method: 'DELETE',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(200)
  })
})