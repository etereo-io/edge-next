import {
  addShoppingCart,
} from '../../../../lib/api/entities/shopping-carts'
import getPermissions from '../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../lib/api/auth/token'
import handler from '../../../../pages/api/shopping-carts/index'
import request from '../requestHandler'

jest.mock('../../../../lib/api/auth/token')
jest.mock('../../../../lib/permissions/get-permissions')
jest.mock('../../../../lib/api/entities/shopping-carts')

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
    addShoppingCart.mockReturnValue(Promise.resolve({
      id: 'abc'
    }))
    getPermissions.mockReturnValue({
      'purchasing.buy': ['USER'],
      'purchasing.admin': ['ADMIN'],
      'content.product.purchasing.buy': ['USER']
    })
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    addShoppingCart.mockReset()
  })

  test('Should not allow public users to create shopping carts', async () => {

    getSession.mockReturnValueOnce(null)

    const newShoppingCart = {
      products: [{
        id: 'abc',
        type: 'product',
        price: 0.0
      }]
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newShoppingCart
    });

    expect(res.statusCode).toBe(401)
  })


  test('Should allow registered users to create shopping carts', async () => {

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'ada'
    })

    const newShoppingCart = {
      products: [{
        productId: 'abc',
        productContentType: 'product',
        amount: 1
      }]
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newShoppingCart
    });

    expect(addShoppingCart).toHaveBeenCalledWith({
      ...newShoppingCart,
      userId: 'ada'
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return error if a product is not allowed', async () => {

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'ada'
    })

    const newShoppingCart = {
      products: [{
        productId: 'abc',
        productContentType: 'product',
        amount: 1
      }, 
      {
        productId: 'abc',
        productContentType: 'post',
        amount: 1
      }]
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newShoppingCart
    });

   
    expect(res.statusCode).toBe(401)
  })
  test('Should return error if a product is malformed', async () => {

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'ada'
    })

    const newShoppingCart = {
      products: [{
        productId: 'abc',
        productContentType: 'product',
        amount: 0 // Invalid amount
      }]
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        userId: ''
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newShoppingCart
    });

   
    expect(res.statusCode).toBe(400)
  })
  
})