import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/content/[type]/[slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = [
    {
      type: 'post',
      id: 0,
      author: '1',
      title: 'Example post',
      slug: 'example-post-0',
      image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      description: 'This is an example description',
      draft: false,
      tags: [
        {
          slug: 'software',
          label: 'SOFTWARE',
        },
        {
          slug: 'ai',
          label: 'AI',
        },
      ],
    },
    {
      type: 'post',
      id: 1,
      author: '2',
      title: 'Example post',
      slug: 'example-post-1',
      image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      description: 'This is an example description',
      draft: true,
      tags: [
        {
          slug: 'software',
          label: 'SOFTWARE',
        },
        {
          slug: 'ai',
          label: 'AI',
        },
      ],
    },
  ]

  const mockPostContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },

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
        title: true,
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
        newUserRoles: ['USER'],
      }
    }),
  }
})

describe('Integrations tests for content detail endpoint', () => {
  
  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

 
  test('Should return 405 if required query string is missing', async () => {
    
    const res = await request(handler, {
      method: 'GET',
    });


    expect(res.statusCode).toBe(405)
  })

  test('Should return 405 if required query slug is missing', async () => {
 
    const res = await request(handler, {
      method: 'GET',
      query : { type: 'post' }
    });


    expect(res.statusCode).toBe(405)
  })

  test('Should return content details given a valid request', async () => {

  
    getPermissions.mockReturnValue({
      'content.post.read': ['PUBLIC'],
      'content.post.admin': ['ADMIN'],
    })

    const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-0' }
    });


    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      title: expect.any(String),
      type: 'post',
      slug: 'example-post-0',
      description: expect.any(String),
      tags: expect.any(Array),
      image: expect.any(String),
      id: expect.anything(),
    })
  })

  test('Should return 200 for a role that is not public', async () => {

    getPermissions.mockReturnValue({
      'content.post.read': ['PUBLIC'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

    const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-0' }
    });


    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {

    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-0' }
    });


    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 if it does have permissions to access for USER', async () => {

    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
    })

      const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-0' }
    });


    expect(res.statusCode).toBe(200)
  })

  test('Should return 200 for ADMIN', async () => {


    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

      const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-1' }
    });


    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 for USER if content is not owned and is draft', async () => {


    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: '1',
    })

      const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-1' }
    });


    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for USER if content is owned and is draft', async () => {


    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: '2',
    })

      const res = await request(handler, {
      method: 'GET',
      query : { type: 'post', slug: 'example-post-1' }
    });


    expect(res.statusCode).toBe(200)
  })
})
