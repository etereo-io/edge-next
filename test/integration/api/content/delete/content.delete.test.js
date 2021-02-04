import {
  deleteOneContent,
  findOneContent,
} from '../../../../../lib/api/entities/content'

import { deleteActivity } from '../../../../../lib/api/entities/activity'
import { deleteComment } from '../../../../../lib/api/entities/comments'
import { deleteFile } from '../../../../../lib/api/storage'
import { deleteInteractions } from '../../../../../lib/api/entities/interactions'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/content/[type]/[slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/entities/comments')
jest.mock('../../../../../lib/api/entities/interactions')
jest.mock('../../../../../lib/api/entities/activity')
jest.mock('../../../../../lib/api/entities/content')

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

      user : {
        permissions: {
          
        },
  
        roles: [{ label : 'user', value: 'USER'}],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for content deletion endpoint', () => {
 
  beforeEach(() => {
    deleteOneContent.mockReturnValue(Promise.resolve())
    deleteActivity.mockReturnValue(Promise.resolve())
    deleteComment.mockReturnValue(Promise.resolve())
    deleteFile.mockReturnValue(Promise.resolve())
    deleteInteractions.mockReturnValue(Promise.resolve())
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
    getPermissions.mockReset()
    getSession.mockReset()
    findOneContent.mockReset()
    deleteComment.mockReset()
    deleteActivity.mockReset()
    deleteOneContent.mockReset()
    deleteInteractions.mockReset()
  })

  test('Should return 405 if required query string is missing', async () => {
    const res = await request(handler, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(405)

  })

  describe('Correct delete', () => {
    test('Should delete comments, files and activity if a content is deleted', async () => {
        
      getPermissions.mockReturnValue({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'userId',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: { type: 'post', slug: 'example-post-0' },
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
  
      expect(res.statusCode).toBe(200)

      expect(deleteFile).toHaveBeenCalledWith('abc.test')
      expect(deleteComment).toHaveBeenCalledWith({
        contentId: 'contentid',
      })
      expect(deleteActivity).toHaveBeenCalledWith({
        role: 'user',
        meta: {
          contentId: 'contentid',
        },
      })
      expect(deleteOneContent).toHaveBeenCalledWith('post', {
        id: 'contentid',
      })
      expect(deleteInteractions).toHaveBeenCalledWith({
        entity: 'content',
        entityId: 'contentid'
      })
    })
  })

  describe('Invalid delete', () => {
    test('Should return 401 when deleting other person content without the content.post.delete permission', async () => {
        
      getPermissions.mockReturnValue({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: { type: 'post', slug: 'example-post-0' },
        headers: {
          'Content-Type': 'application/json',
        }
      });
  

      expect(res.statusCode).toBe(401)
      expect(res.body).toMatchObject({
        error: 'User not authorized to perform operation on content post',
      })
    })

    test('Should return 200 when deleting other person content with the content.post.delete permission', async () => {
        

      getPermissions.mockReturnValue({
        'content.post.delete': ['USER'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const res = await request(handler, {
        method: 'DELETE',
        query: { type: 'post', slug: 'example-post-0' },
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
  
      expect(res.statusCode).toBe(200)
    })

    test('Should return 200 when deleting other person content with the content.post.admin permission', async () => {
      
      getPermissions.mockReturnValue({
        'content.post.delete': ['ADMIN'],
        'content.post.admin': ['USER'],
      })
      
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const params = { type: 'post', slug: 'example-post-0' }

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
      'content.post.delete': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })
    
    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })
    
    const params = { type: 'post', slug: 'example-post-0' }
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
      'content.post.delete': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })
    
    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })
    const params = { type: 'post', slug: 'example-post-0' }
    
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
