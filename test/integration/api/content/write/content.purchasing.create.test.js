import {
  addContent,
  findOneContent,
} from '../../../../../lib/api/entities/content'
import {
  deleteFile,
  uploadFile,
} from '../../../../../lib/api/storage'

import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]'
import request from '../../requestHandler'
import {
  string,
} from 'yup'

jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content')

jest.mock('../../../../../edge.config', () => {
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
        ship: ['ADMIN'],
        admin: ['ADMIN']
      }
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

describe('Allow to create content that is purchasable', () => {
  beforeEach(() => {
    addContent.mockReturnValue(Promise.resolve({
      id: 'abc'
    }))
    getPermissions.mockReturnValue({
      'content.product.create': ['USER', 'SHOP'],
      'content.product.admin': ['ADMIN'],
      'content.product.purchasing.sell': ['ADMIN', 'SHOP']
    })
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    addContent.mockReset()
  })

  test('Should return allow to save the content if the user can create content, but not store purchasing options if the user can not sell', async () => {


    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })

    const newProduct = {
      title: 'testatadas dsaasd',
      description: 'test test  test test test test test test test test test test test test test test ',
      purchasingOptions: {
        price: 1,
        stock: 1
      }
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        type: 'product'
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newProduct
    });


    expect(res.statusCode).toBe(200)

    const calls = addContent.mock.calls
    expect(calls[0][0]).toEqual('product')
    expect(calls[0][1]).not.toHaveProperty('purchasingOptions')
    expect(calls[0][1]).toHaveProperty('title')

  })

  test('Check purchasing options format if the role can sell', async () => {


    getSession.mockReturnValueOnce({
      roles: ['SHOP'],
      id: 'test-id',
    })

    const newProduct = {
      title: 'testatadas dsaasd',
      description: 'test test  test test test test test test test test test test test test test test ',
      purchasingOptions: {
        price: 1,
        stock: 1
      }
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        type: 'product'
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newProduct
    });


    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({
      error: 'Invalid data: Missing currency',
    })

    expect(addContent).not.toHaveBeenCalled()

  })

  test('Store purchasing options if the role can sell', async () => {


    getSession.mockReturnValueOnce({
      roles: ['SHOP'],
      id: 'test-id',
    })

    const newProduct = {
      title: 'testatadas dsaasd',
      description: 'test test  test test test test test test test test test test test test test test ',
      purchasingOptions: {
        price: 1,
        stock: 1,
        currency: 'euro'
      }
    }

    const res = await request(handler, {
      method: 'POST',
      query: {
        type: 'product'
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newProduct
    });


    expect(res.statusCode).toBe(200)


    const calls = addContent.mock.calls
    expect(calls[0][0]).toEqual('product')
    expect(calls[0][1]).toHaveProperty('purchasingOptions')
    expect(calls[0][1].purchasingOptions).toEqual(newProduct.purchasingOptions)

    expect(calls[0][1]).toHaveProperty('title')

  })



  // Should allow a normal user to store the data but without the shopping info

  // Should allow a SHOP to set purchasing options
  // Expect add content to be called with the purchasing options
  // Should allow an ADMIN to set purchasing options
  // Should return error if purchasing options format is wrong
})