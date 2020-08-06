import { findContent, findOneContent } from '../../../../../lib/api/entities/content/content'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/api/entities/content/content')

/*
  Scenario: 
    We have a content type that is private in the general platform, and only admin can operate.
    This content type is available for group members. 
    - Check that a group member can access this content type only if the GID of the content type is the group one
    - Give group based permissions and check that they apply with the GID
    - Check that a normal user can not get this content type if it's not in the group
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
        
      },

      roles: [{ label : 'user', value: 'USER'}],
      newUserRoles: ['USER'],
    },

    contentTypes: [{
      slug: 'post',
      permissions: {
        read: ['GROUP_MEMBER', 'GROUP_ADMIN'],
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

describe('Integrations tests for content retrieval in a group', () => {
  let server
  let url

  beforeEach(() => {
    findContent.mockReturnValue(Promise.resolve({
      results: []
    }))
  })
 

  afterEach(() => {
    getSession.mockReset()
    findOneContent.mockReset()
    findContent.mockReset()
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

  test('Should not allow to fetch posts for a normal user', async () => {

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const urlToBeUsed = new URL(url)
    const params = { type: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    const response = await fetch(urlToBeUsed.href)

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

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toEqual(404)
  })

  test('Should not allow a non member to retrieve content ', async () => {
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

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toEqual(401)
  })

  test('Should allow a member to retrieve content ', async () => {
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

    const response = await fetch(urlToBeUsed.href)

    expect(response.status).toEqual(200)
    expect(findContent).toHaveBeenCalledWith("post", 
      {"draft": false, "groupId": "agroup", "groupType": "project"}, 
      {"from": undefined, "limit": undefined, "sortBy": undefined, "sortOrder": undefined})
  })


  describe('Group based permissions', () => {
    test('Should allow a user with group based permissions to access the content ', async () => {
      findOneContent.mockReturnValue(Promise.resolve({ id: 'abc',
        members: [{
          id: 'user1',
          roles: ['ANOTHER_ROLE']
        }],
        permissions: {
          'group.project.content.post.read' : ['ANOTHER_ROLE']
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
  
      const response = await fetch(urlToBeUsed.href)
  
      expect(response.status).toEqual(200)
      expect(findContent).toHaveBeenCalledWith("post", 
        {"draft": false, "groupId": "agroup", "groupType": "project"}, 
        {"from": undefined, "limit": undefined, "sortBy": undefined, "sortOrder": undefined})
    })
  })
 
})
