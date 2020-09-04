import {
  findComments,
} from '../../../../../lib/api/entities/comments'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/comments'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/comments')

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
      title: true,
      placeholder: 'Title',
    }, ],
  }

  const mockProductContentType = {
    title: 'Product',

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
      title: true,
      placeholder: 'Title',
    }, ],
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

// Find comments by contentType + contentId,
// find comments by author
// find comments by contentType

describe('Integrations tests for comment list read endpoint', () => {


  beforeEach(() => {
    findComments.mockReturnValue(
      Promise.resolve({
        from: 0,
        limit: 15,
        results: [],
      })
    )
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    findComments.mockReset()
  })



  test('Should return 401 if contentType does not exist', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'something'
      }
    });


    expect(findComments).not.toHaveBeenCalled()

    expect(res.statusCode).toBe(401)
  })

  test('Should return 401 if contentType does not allow comments', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': [],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'product'
      }
    });


    expect(findComments).not.toHaveBeenCalled()

    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 if contentType exists', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post'
      }
    });


    expect(res.statusCode).toBe(200)
    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })
  })

  test('Should allow contentId option', async () => {


    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        contentId: 'example'
      }
    });

    expect(res.statusCode).toBe(200)

    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      contentId: 'example',
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })
  })

  test('Should allow conversationId option', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        conversationId: 'conversationId'
      }

    });


    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      conversationId: 'conversationId',
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should allow conversationId option to false if we want to ellicit null conversationid', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        conversationId: 'false'
      }
    });


    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      conversationId: null,
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should allow author option', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        author: 'author'
      }
    });


    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      author: 'author',
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should allow empty contentType, meaning that it will call to all the available contents', async () => {

    getSession.mockReturnValue({
      roles: [],
    })

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
      'content.product.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        author: 'author'
      }
    });


    expect(findComments).toHaveBeenCalledWith({
      contentType: {
        $in: ['post', 'product']
      },
      author: 'author',
      groupId: null,
      groupType: null
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should accept pagination options', async () => {

    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        from: 10,
        limit: 20
      }
    });


    expect(findComments).toHaveBeenCalledWith({
      contentType: 'post',
      groupId: null,
      groupType: null
    }, {
      from: 10,
      limit: 20,
      sortBy: undefined,
      sortOrder: undefined
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if user is not allowed', async () => {

    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['USER'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post',
        contentId: 'example-post-0'
      }
    });


    expect(res.statusCode).toBe(401)
  })

  test('Should return pagination list results', async () => {
    getSession.mockReturnValue()

    getPermissions.mockReturnValue({
      'content.post.comments.read': ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        contentType: 'post'
      }
    });


    expect(res.statusCode).toBe(200)

    expect(res.body).toMatchObject({
      results: [],
      from: 0,
      limit: 15,
    })
  })
})