import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '../../../../../lib/api/entities/comments'

import {
  deleteActivity,
} from '../../../../../lib/api/entities/activity'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/comments/[id]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/comments')
jest.mock('../../../../../lib/api/entities/activity')

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

    fields: [{
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

      user: {
        permissions: {

        },

        roles: [{
          label: 'user',
          value: 'USER'
        }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for comment deletion endpoint', () => {


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
    getPermissions.mockReset()
    getSession.mockReset()
    findOneComment.mockReset()
    deleteComment.mockReset()
    deleteActivity.mockReset()
    deleteOneComment.mockReset()
  })



  test('Should return 405 if required query string is missing', async () => {

    const res = await request(handler, {
      method: 'DELETE'
    });

    expect(res.statusCode).toBe(405)
  })

  describe('Correct delete', () => {
    test('Should delete child comments if the comment has no conversationId and activity if a comment is deleted', async () => {

      getPermissions.mockReturnValue({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: {
          contentType: 'post',
          contentId: '5ebe9d562779ed4d88c94f2f',
          id: '5ebf9dd6e1d3192ac0ae2466',
        }
      });

  
      expect(res.statusCode).toBe(200)

      expect(deleteOneComment).toHaveBeenCalledWith({
        id: '5ebf9dd6e1d3192ac0ae2466',
      })
      
      expect(deleteActivity).toHaveBeenCalledWith({
        role: 'user',
        meta: {
          commentId: '5ebf9dd6e1d3192ac0ae2466',
        },
      })

      expect(deleteComment).toHaveBeenCalledWith({
        conversationId: '5ebf9dd6e1d3192ac0ae2466',
      })

      
    })
  })

  describe('Invalid delete', () => {
    test('Should return 401 when deleting other person content without the content.post.delete permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: {
          contentType: 'post',
          contentId: '5ebe9d562779ed4d88c94f2f',
          id: '5ebf9dd6e1d3192ac0ae2466',
        }
      });

  

      expect(res.statusCode).toBe(401)
      expect(res.body).toMatchObject({
        error: 'User not authorized to perform operation on comment post',
      })
    })

    test('Should return 200 when deleting other person content with the content.post.comments.delete permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.comments.delete': ['USER'],
        'content.post.comments.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: {
          contentType: 'post',
          contentId: '5ebe9d562779ed4d88c94f2f',
          id: '5ebf9dd6e1d3192ac0ae2466',
        }
      });

  
      expect(res.statusCode).toBe(200)
    })

    test('Should return 200 when deleting other person content with the content.post.admin permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.comments.delete': ['ADMIN'],
        'content.post.comments.admin': ['USER'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: {
          contentType: 'post',
          contentId: '5ebe9d562779ed4d88c94f2f',
          id: '5ebf9dd6e1d3192ac0ae2466',
        }
      });

  
      expect(res.statusCode).toBe(200)
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {

    getPermissions.mockReturnValue({
      'content.post.comments.delete': ['ADMIN'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })


    const res = await request(handler, {
      method: 'DELETE',
      query: {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }
    });


    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {

    getPermissions.mockReturnValue({
      'content.post.comments.delete': ['ADMIN'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const res = await request(handler, {
      method: 'DELETE',
      query: {
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        id: '5ebf9dd6e1d3192ac0ae2466',
      }
    });


    expect(res.statusCode).toBe(200)
  })
})