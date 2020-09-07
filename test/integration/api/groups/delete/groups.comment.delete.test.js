import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '../../../../../lib/api/entities/comments'

import { findOneContent } from '../../../../../lib/api/entities/content'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/comments/[id]'
import { onCommentDeleted } from '../../../../../lib/api/hooks/comment.hooks'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/api/entities/content')
jest.mock('../../../../../lib/api/entities/comments')
jest.mock('../../../../../lib/api/hooks/comment.hooks')


/*
  Scenario: 
    We have a content type that is public or private in the general platform
    This content type has comments available when posted inside a group 
    - Check that a group member can delete it's own comments, and no one elses
    - Check that somebody with the permissions to delete comments, can delete them
*/

jest.mock('../../../../../edge.config', () => {
  const mockPostContentType = {
    title: 'Post',

    slug: 'post',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['ADMIN'],
      create: ['ADMIN'],
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
        delete: ['ADMIN', 'COMMENTS_DELETE_ROLE'],
        admin: ['ADMIN', 'COMMENTS_ADMIN'],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        minlength: 1,
        placeholder: 'Title',
      }
    ],
  }

  
  const mockGroupType = {
    title: 'Project',

    slug: 'project',

    slugGeneration: ['title', 'createdAt'],

    publishing: {
      draftMode: true
    },

    permissions: {
      read: ['PUBLIC'],
      create: ['ADMIN', 'USER'],
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        title: true,
        minlength: 2,
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
      }
    ],

    user : {
      permissions: {
        
      }
    },

    contentTypes: [{
      slug: 'post',
      comments: {
        enabled: true,
        permissions: {
          delete: ['GROUP_ADMIN']
        }
      },
      permissions: {
        create: ['GROUP_MEMBER', 'GROUP_ADMIN'],
        admin: ['GROUP_ADMIN']
      }
    }]
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',
  
      groups: {
        types: [mockGroupType]
      },

      content: {
        types: [mockPostContentType]
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

describe('Integrations tests for comment creation in a group content', () => {
 

  beforeEach(() => {
    deleteComment.mockReturnValue(Promise.resolve())
    deleteOneComment.mockReturnValue(Promise.resolve())
    onCommentDeleted.mockReturnValue(Promise.resolve())
  })

  afterEach(() => {
    getSession.mockReset()
    deleteComment.mockReset()
    findOneComment.mockReset()
    deleteOneComment.mockReset()
    findOneContent.mockReset()
  })
  
   

  test('should return check the normal permissions if the group is not found', async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }

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
        groupId: 'agroup',
        groupType: 'project',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve())

    getSession.mockReturnValueOnce({
      roles: ['COMMENTS_DELETE_ROLE'],
      id: 'i am another user',
    })
    
    const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
  })

  test('should return 401 for someone outside the group roles', async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }


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
        groupId: 'agroup',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['GROUP_ADMIN']
        }]
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'i am another user',
    })
    
    const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(401)
  })

  test('should return 200 for someone outside the group roles but general comments permission',async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }


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
        groupId: 'agroup',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['GROUP_ADMIN']
        }]
      }))

    getSession.mockReturnValueOnce({
      roles: ['COMMENTS_ADMIN'],
      id: 'i am another user',
    })
    
   
    const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
    
  })
  
  

  test('should return 401 for someone inside the group but without permission', async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }


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
        groupId: 'agroup',
        groupType: 'project',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['GROUP_MEMBER']
        }]
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })
    
   
    const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(401)
    
  })

  

  test('should return 200 for someone inside the group with permission',  async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }


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
        groupId: 'agroup',
        groupType: 'project',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['GROUP_ADMIN']
        }]
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })
    
   
    const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
    
  })

  test('should return 200 for comment owner', async () => {
      
    const params = {
      contentType: 'post',
      contentId: '5ebe9d562779ed4d88c94f2f',
      id: '5ebf9dd6e1d3192ac0ae2466',
    }


    findOneComment.mockReturnValue(
      Promise.resolve({
        author: 'theauthor',
        createdAt: 1589616086584,
        contentType: 'post',
        contentId: '5ebe9d562779ed4d88c94f2f',
        message: 'Another test comment',
        conversationId: null,
        slug: '1589616086584-5eb3240d5dd70535e812f402',
        id: '5ebf9dd6e1d3192ac0ae2466',
        groupId: 'agroup',
        user: {
          username: 'rafael',
        },
        replies: 2,
      })
    )

    findOneContent
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['GROUP_ADMIN']
        }]
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'theauthor',
    })
    
   const res = await request(handler, {
      method: 'DELETE',
      query:  params,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    expect(res.statusCode).toBe(200)
    
  })
  
})
