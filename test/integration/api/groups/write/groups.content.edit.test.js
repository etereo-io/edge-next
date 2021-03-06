import { findOneContent, updateOneContent } from '../../../../../lib/api/entities/content'

import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]/[slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/entities/content')

/*
  Scenario: 
    We have a content type that is private in the general platform, and only admin can operate.
    This content type is available for group members. 
    - Check that a group member can edit this content type only if the GID of the content type is the group one
    - Give group based permissions and check that they apply with the GID
    - Check that a normal user can not edit this content type if it's not in the group with an authorized role
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
        delete: ['ADMIN'],
        admin: ['ADMIN'],
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
      
      permissions: {
        update: ['GROUP_MEMBER', 'GROUP_ADMIN'],
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

describe('Integrations tests for content edition in a group', () => {
 

  beforeEach(() => {
    updateOneContent.mockReturnValue(Promise.resolve({ id: 'abc'}))
  })

  afterEach(() => {
    getSession.mockReset()
    updateOneContent.mockReset()
    findOneContent.mockReset()
  })
  

  test('Should not allow to update a post without a groupId and groupType', async () => {
    // Find post
    findOneContent.mockReturnValueOnce(Promise.resolve({
      id: 'some-post'
    }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })
        
    const newPost = {
      title: 'test'
    }

    const res = await request(handler, {
      method: 'PUT',
      query: { type: 'post', slug: 'a-post-slug' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });
    

    expect(res.statusCode).toEqual(401)
  })

  test('Should return 404 if the group is not found ', async () => {
    // Find post
    findOneContent.mockReturnValueOnce(Promise.resolve({
      id: 'some-post',
      groupId: 'abc'
    }))
 
    // Find the group
    findOneContent.mockReturnValueOnce(Promise.resolve(null))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const params = { type: 'post', slug: 'a-post-slug', groupId: 'agroup', groupType: 'a nother'}

    const newPost = {
      title: 'test'
    }

    const res = await request(handler, {
      method: 'PUT',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });
    
    expect(res.statusCode).toEqual(404)
  })

  test('Should not allow a non member to update content ', async () => {
    // Find post
    findOneContent.mockReturnValueOnce(Promise.resolve({
      id: 'some-post'
    }))

    // Find the group
    findOneContent.mockReturnValueOnce(Promise.resolve({ id: 'abc',
      members: [{
        id: 'user1',
        roles: ['GROUP_MEMBER']
      }]
    }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

      
    const params = { type: 'post', slug: 'a-post-slug', groupId: 'agroup', groupType: 'project'}

    const newPost = {
      title: 'test'
    }
    
    const res = await request(handler, {
      method: 'PUT',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });
    

    expect(res.statusCode).toEqual(401)
  })

  test('Should allow a member to update content ', async () => {
    // Find post
    findOneContent.mockReturnValue(Promise.resolve({}))
      .mockReturnValueOnce(Promise.resolve({
        id: 'some-post',
        groupId: 'agroup',
        groupType: 'project'
      }))
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

      
    const params = { type: 'post', slug: 'a-post-slug', groupId: 'agroup', groupType: 'project'}

    const newPost = {
      title: 'test'
    }
    
    const res = await request(handler, {
      method: 'PUT',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });
    

    expect(res.statusCode).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith("post", 'some-post', {
      title: 'test'
    })
  })


  describe('Group based permissions', () => {
    test('Should allow a user with group based permissions to access the content ', async () => {
      // Find post
      findOneContent.mockReturnValue(Promise.resolve({}))
      .mockReturnValueOnce(Promise.resolve({
        id: 'some-post',
        groupId: 'agroup',
        groupType: 'project'
      }))
      .mockReturnValueOnce(Promise.resolve({ 
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['ANOTHER_ROLE']
        }],
        permissions: {
          'group.project.content.post.update' : ['ANOTHER_ROLE']
        }
      }))
  
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'user1',
      })
  
        
      const params = { type: 'post', slug: 'a-post-slug', groupId: 'agroup', groupType: 'project'}
  
      const newPost = {
        title: 'tes'
      }

      const res = await request(handler, {
        method: 'PUT',
        query: params,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost)
      });
      
  
      expect(res.statusCode).toEqual(200)
     
    })
  })

 
})
