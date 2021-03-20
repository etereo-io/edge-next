import {
  addContent,
  findOneContent,
} from '../../../../../lib/api/entities/content'
import { deleteFile, uploadFile } from '../../../../../lib/api/storage'

import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import  handler from '../../../../../pages/api/content/[type]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/storage')
jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = []

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
        roles: [{ label : 'user', value: 'USER'}],
        newUserRoles: ['USER']
      }
    }),
  }
})

describe('Integrations tests for content creation endpoint', () => {
  afterEach(() => {
    addContent.mockReturnValue(Promise.resolve({
      id: 'abc'
    }))
    findOneContent.mockReturnValue(Promise.resolve(null))
    getPermissions.mockReset()
    getSession.mockReset()
  })

  test('Should return 405 if required query string is missing', async () => {
    const res = await request(handler, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {}
    });


    expect(res.statusCode).toBe(405)
  })

  test('Should return 400 if content validation fails', async () => {

    getPermissions.mockReturnValue({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })

    const newPost = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost
    });


    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({
      error: 'Invalid data: title length is less than 8',
    })
  })

  test('Should return content details given a valid request', async () => {

    getPermissions.mockReturnValue({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })

    const newPost = {
      title: 'test test test test test test ',
      description:
        'test test  test test test test test test test test test test test test test test ',
      tags: [
        {
          label: 'Hello',
          slug: 'hello',
        },
        {
          label: 'World',
          slug: 'world',
        },
      ],
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost
    });



    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      title: newPost.title,
      type: 'post',
      slug: expect.any(String),
      description: newPost.description,
      tags: [
        {
          label: 'Hello',
          slug: 'hello',
        },
        {
          label: 'World',
          slug: 'world',
        },
      ],
      image: null,
      author: 'test-id',
      id: expect.anything(),
    })
  })

  test('Should return 400 if the slug is duplicated', async () => {

    getPermissions.mockReturnValue({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id',
    })
    
    findOneContent.mockReturnValue({
      id: 'abc'
    })

    const newPost = {
      title: 'test test test test test test ',
      seo: {
        slug: '1',
        title: '1,'
      },
      description:
        'test test  test test test test test test test test test test test test test test ',
      tags: [
        {
          label: 'Hello',
          slug: 'hello',
        },
        {
          label: 'World',
          slug: 'world',
        },
      ],
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost
    });


    expect(res.statusCode).toBe(400)
    
   
  })

  test('Should return 401 for a role that is PUBLIC', async () => {
      
    getPermissions.mockReturnValue({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const newPost = {
      title: 'test',
      description:
        'test test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost
    });


    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {
      
    getPermissions.mockReturnValue({
      'content.post.create': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const newPost = {
      title: 'test test test test test test test test test ',
      description:
        'test test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost
    });


    expect(res.statusCode).toBe(200)
  })

  /*describe('form data', () => {
    test('should allow to send data as a form', async () => {
        
      const params = { type: 'post' }
      Object.keys(params).forEach((key) =>
        urlToBeUsed.searchParams.append(key, params[key])
      )

      getPermissions.mockReturnValue({
        'content.post.create': ['PUBLIC'],
      })

      getSession.mockReturnValueOnce({
        roles: ['PUBLIC'],
        id: 'a-user-id',
      })

      const data = new FormData()
      data.append('title', 'the title test  test  test  test  test  test ')
      data.append('description', ' test  test  test  test  test  test  test  test  test  test  test ')
      // data.append('tags', [{ label: 'Hello', slug: 'hello'}, { label: 'World', slug: 'world'}]

      const response = await fetch(urlToBeUsed.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: data,
      })

        console.log(res.body)
      expect(res.statusCode).toBe(200)

      expect(res.body).toMatchObject({
        title: expect.any(String),
        type: 'post',
        slug: expect.any(String),
        description: expect.any(String),
        /*tags:  [{
          label: 'Hello',
          slug: 'hello'
        }, {
          label: 'World',
          slug: 'world'
        }],
        image: null,
        author: 'a-user-id',
        id: expect.anything(),
      })
    })
  })*/
})
