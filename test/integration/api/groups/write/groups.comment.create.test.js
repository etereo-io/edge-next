import {
  addComment,
} from '../../../../../lib/api/entities/comments'
import {
  findOneContent,
} from '../../../../../lib/api/entities/content'
import {
  getSession,
} from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/comments'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/api/entities/content')
jest.mock('../../../../../lib/api/entities/comments')

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

    fields: [{
      name: 'title',
      type: 'text',
      label: 'Title',
      minlength: 1,
      placeholder: 'Title',
    }],
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

    fields: [{
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

    user: {
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

describe('Integrations tests for comment creation in a group content', () => {

  beforeEach(() => {
    addComment.mockReturnValue(Promise.resolve({
      id: 'abc'
    }))
  })

  afterEach(() => {
    getSession.mockReset()
    addComment.mockReset()
    findOneContent.mockReset()
  })

  test('Should not allow to create a comment in a content that does not have a group', async () => {
    findOneContent.mockReturnValue(Promise.resolve({}))
      .mockReturnValueOnce(Promise.resolve({
        id: 'some-post',
      }))
      .mockReturnValueOnce(Promise.resolve({
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['ANOTHER_ROLE']
        }],
        permissions: {
          'group.project.content.post.update': ['ANOTHER_ROLE']
        }
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })


    const params = {
      contentType: 'post',
      contentId: 'abc'
    }


    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newComment
    })

    expect(res.statusCode).toEqual(401)
  })

  test('Should return 404 if the content is not found', async () => {
    findOneContent.mockReturnValue(Promise.resolve({}))
      .mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValueOnce(Promise.resolve({
        id: 'agroup',
        type: 'project',
        members: [{
          id: 'user1',
          roles: ['ANOTHER_ROLE']
        }],
        permissions: {
          'group.project.content.post.update': ['ANOTHER_ROLE']
        }
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const params = {
      contentType: 'post',
      contentId: 'abc'
    }

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newComment
    })
    expect(res.statusCode).toEqual(404)
  })

  test('Should not allow a non member to create a coment', async () => {
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
          'group.project.content.post.comments.create': ['ANOTHER_ROLE']
        }
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const params = {
      contentType: 'post',
      contentId: 'abc'
    }

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newComment
    })

    expect(res.statusCode).toEqual(401)
  })

  test('Should allow a  member to create a coment', async () => {
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
          'group.project.content.post.comments.create': ['ANOTHER_ROLE']
        }
      }))

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1', // The right role
    })


    const params = {
      contentType: 'post',
      contentId: 'abc'
    }

    const newComment = {
      message: 'abc abc',
      conversationId: null
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newComment
    })

    expect(res.statusCode).toEqual(200)
  })

})