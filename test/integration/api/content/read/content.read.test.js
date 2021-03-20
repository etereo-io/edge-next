import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/content/[type]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = []

  for (var i = 0; i < 100; i++) {
    const userId = Math.round(Math.random() * 10)

    mockInitialPosts.push({
      type: 'post',
      id: i,
      author: userId,
      title: 'Example post',
      slug: 'example-post-' + i,
      image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      description: 'This is an example description',
      draft: Math.random() > 0.5 ? true : false,
      tags: [{
          slug: 'software',
          label: 'SOFTWARE',
        },
        {
          slug: 'ai',
          label: 'AI',
        },
      ],
    })
  }

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

    fields: [{
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
        roles: [{
          label: 'user',
          value: 'USER'
        }],
        newUserRoles: ['USER'],
      }
    }),
  }
})

describe('Integrations tests for content endpoint', () => {

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

  test('Should return 405 if required query string is missing', async () => {
    const res = await request(handler, {
      method: 'GET'
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
      query: {
        type: 'post'
      }
    });


    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      results: expect.any(Array),
      from: expect.any(Number),
      limit: expect.any(Number),
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
      query: {
        type: 'post'
      }
    });


    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if it does not have permissions to access', async () => {

    getPermissions.mockReturnValue({
      'content.post.read': ['USER'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const res = await request(handler, {
      method: 'GET',
      query: {
        type: 'post'
      }
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
      query: {
        type: 'post'
      }
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
      query: {
        type: 'post'
      }
    });


    expect(res.statusCode).toBe(200)
  })

  describe('Pagination', () => {
    test('Should return from 1 and elements from 15 to 29', async () => {


      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 15,
          limit: 15
        }
      });

    
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        results: expect.any(Array),
        from: 15,
        limit: 15,
      })

      expect(res.body.from).toEqual(15)
      expect(res.body.limit).toEqual(15)
      expect(res.body.results[0].id).toEqual(15)
      expect(res.body.results[res.body.results.length - 1].id).toEqual(29)
    })

    test('Should return from 2 and elements from 40 to 59', async () => {

      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 40,
          limit: 20
        }
      });

    
      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        results: expect.any(Array),
        from: 40,
        limit: 20,
      })

      expect(res.body.from).toEqual(40)
      expect(res.body.limit).toEqual(20)
      expect(res.body.results[0].id).toEqual(40)
      expect(res.body.results[res.body.results.length - 1].id).toEqual(59)
    })
  })

  describe('Filter by author', () => {
    test('Should return only items for that author', async () => {

      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 15,
          limit: 15,
          author: 2
        }
      });

    
      expect(res.statusCode).toBe(200)
      for (var i = 0; i < res.body.results.length; i++) {
        expect(res.body.results[i].author).toEqual(2)
      }
    })
  })

  describe('Draft mode', () => {
    test('Should return only items that are not drafts', async () => {

      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 15,
          limit: 15,
          author: 2
        }
      });

    
      expect(res.statusCode).toBe(200)
      for (var i = 0; i < res.body.results.length; i++) {
        expect(res.body.results[i].draft).not.toEqual(true)
      }
    })

    test('Should return all the items for admin', async () => {

      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
        id: '1',
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 0,
          limit: 50,
          author: 2
        }
      });

    
      expect(res.statusCode).toBe(200)
      let someIsDraft = false
      for (var i = 0; i < res.body.results.length; i++) {
        if (res.body.results[i].draft) {
          someIsDraft = true
        }
      }

      expect(someIsDraft).toBe(true)
    })

    test('Should all the items for own user', async () => {


      getPermissions.mockReturnValue({
        'content.post.read': ['PUBLIC'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '2',
      })

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'post',
          from: 0,
          limit: 150,
          author: '2'
        }
      });

    
      expect(res.statusCode).toBe(200)
      let someIsDraft = false
      for (var i = 0; i < res.body.results.length; i++) {
        if (res.body.results[i].draft) {
          someIsDraft = true
        }
      }

      expect(someIsDraft).toBe(true)
    })
  })
})