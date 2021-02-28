import {
  addShoppingCart,
  findShoppingCarts,
} from '../../../../lib/api/entities/shopping-carts'

import getPermissions from '../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../lib/api/auth/token'
import handler from '../../../../pages/api/shopping-carts/index'
import request from '../requestHandler'

jest.mock('../../../../lib/api/auth/token')
jest.mock('../../../../lib/permissions/get-permissions')
jest.mock('../../../../lib/api/entities/shopping-carts/[id]/index')

jest.mock('../../../../edge.config', () => {
  const mockInitialPosts = []

  const mockPostContentType = {
    title: 'product',

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

    purchasing: {
      enabled: true,
      permissions: {
        buy: ['USER'],
        sell: ['SHOP', 'ADMIN'],
        orders: ['ADMIN'],
        admin: ['ADMIN']
      }
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
        types: [mockPostContentType],
        initialContent: mockInitialPosts,
      },

      user: {
        roles: [{
          label: 'user',
          value: 'USER'
        }],
        newUserRoles: ['USER']
      }
    }),
  }
})

describe('Shopping carts creation', () => {
  beforeEach(() => {
    findShoppingCarts.mockReturnValue(Promise.resolve([]))
    getPermissions.mockReturnValue({
      'purchasing.buy': ['USER'],
      'purchasing.admin': ['ADMIN'],
      'content.product.purchasing.buy': ['USER']
    })
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    findShoppingCarts.mockReset()
  })

  test('Should not allow public users to read shopping carts', async () => {

    getSession.mockReturnValueOnce(null)

    const res = await request(handler, {
      method: 'GET',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(401)
  })

  test('Should not allow user to read other users  shopping carts', async () => {

    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['USER']
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        userId: 'xxxxxx'
      },
      headers: {
        'Content-Type': 'application/json',
      },

    });

    expect(res.statusCode).toBe(401)
  })

  test('Should not allow user to fetch shopping carts without userId', async () => {

    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['USER']
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(res.statusCode).toBe(401)
  })

  test('Should  allow ADMIN to fetch shopping carts without userId', async () => {

    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['ADMIN']
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const calls = findShoppingCarts.mock.calls
    expect(calls[0][0]).not.toHaveProperty('userId')
    expect(res.statusCode).toBe(200)
  })

  test('Should allow users to fetch their own shopping carts', async () => {
    getSession.mockReturnValueOnce({
      id: 'abc',
      roles: ['USER']
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        userId: 'abc'
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(findShoppingCarts).toHaveBeenCalledWith({
      userId: 'abc'
    }, {
      from: undefined,
      limit: undefined,
      sortBy: undefined,
      sortOrder: undefined
    })
    expect(res.statusCode).toBe(200)
  })
})