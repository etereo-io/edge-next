import { addContent, findOneContent } from '../../../../../lib/api/entities/content/content'

import {addComment} from '../../../../../lib/api/entities/comments/comments'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { fillContentWithDefaultData } from '../../../../../lib/api/entities/content/content.utils'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/comments'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/api/entities/content/content')
jest.mock('../../../../../lib/api/entities/content/content.utils')

/*
  Scenario: 
    We have a content type that is public or private in the general platform
    Comments are disabled for this content type. 
    This content type has comments available when posted inside a group 
    - Check that a group member can create comments only if the GID of the content type is the group one
    - Give group based permissions and check that they apply with the GID
    - Check that a normal user can not comment if it's not in the group
    - Give content based permissions disallowing comments on a certain content
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
      enabled: false,
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
      comments: {
        enabled: true,
        permissions: {
          create: ['GROUP_MEMBER']
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
      }
    }),
  }
})

describe('Integrations tests for comment creation in a group content', () => {
  let server
  let url

  beforeEach(() => {
    addComment.mockReturnValue(Promise.resolve({ id: 'abc'}))
  })

  afterEach(() => {
    getSession.mockReset()
    addComment.mockReset()
    findOneContent.mockReset()
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
  
  // TODO: COntinue here
  test('Should not allow to create a comment without a groupId and groupType', async () => {

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })
    
    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }
    
    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )
    
    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toEqual(401)
  })

  test('Should return 404 if the group is not found ', async () => {
    findOneContent.mockReturnValue(Promise.resolve(null))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const urlToBeUsed = new URL(url)
    const params = { type: 'post', groupId: 'agroup', groupType: 'a nother'}

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toEqual(404)
  })

  test('Should not allow a non member to create content ', async () => {
    findOneContent.mockReturnValue(Promise.resolve({ id: 'abc',
      members: [{
        id: 'user1',
        roles: ['GROUP_MEMBER']
      }]
    }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const urlToBeUsed = new URL(url)
    const params = { type: 'post', groupId: 'agroup', groupType: 'project'}

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }
    
    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toEqual(401)
  })

  test('Should allow a member to create content ', async () => {
    findOneContent.mockReturnValue(Promise.resolve({ id: 'abc',
      members: [{
        id: 'user1',
        roles: ['GROUP_MEMBER']
      }]
    }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })

    const urlToBeUsed = new URL(url)
    const params = { type: 'post', groupId: 'agroup', groupType: 'project'}

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }
    
    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(response.status).toEqual(200)
    expect(addContent).toHaveBeenCalledWith("post", {
      groupId: 'agroup',
      groupType: 'project',
      title: 'test',
    })
  })


  describe('Group based permissions', () => {
    test('Should allow a user with group based permissions to access the content ', async () => {
      findOneContent.mockReturnValue(Promise.resolve({ id: 'abc',
        members: [{
          id: 'user1',
          roles: ['ANOTHER_ROLE']
        }],
        permissions: {
          'group.project.content.post.create' : ['ANOTHER_ROLE']
        }
      }))
  
      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'user1',
      })
  
      const urlToBeUsed = new URL(url)
      const params = { type: 'post', groupId: 'agroup', groupType: 'project'}
  
      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )
  
      const newPost = {
        title: 'test'
      }
      
      const response = await fetch(urlToBeUsed.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })
        
      expect(response.status).toEqual(200)
     
    })
  })

 
})
