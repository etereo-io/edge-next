import {
  deleteFile,
  uploadFile,
} from '../../../../../lib/api/storage'

import getPermissions from '../../../../../lib/permissions/get-permissions'
import {
  getSession,
} from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/content/[type]/[slug]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/storage')

jest.mock('../../../../../edge.config', () => {
  const mockInitialPosts = [{
      type: 'post',
      id: 0,
      author: '1',
      title: 'Example post',
      slug: 'example-post-0',
      image: [],
      description: 'This is an example description',
      draft: false,
      tags: [{
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
      image: [{
        path: 'https://image.com',
      }, ],
      description: 'This is an example description',
      draft: true,
      tags: [{
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
        placeholder: 'Title',
        minlength: 8,
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

describe('Integrations tests for content edition endpoint', () => {

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

  test('Should return 405 if required query string is missing', async () => {

    const res = await request(handler, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    expect(res.statusCode).toBe(405)
  })

  describe('Content owner', () => {
    test('Should return 400 if content validation fails', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      const newPost = {
        title: 'tes',
        description: 'test test  test test test test test test test test test test test test test test ',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-0'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      expect(res.statusCode).toBe(400)
      expect(res.body).toMatchObject({
        error: 'Invalid data: title length is less than 8',
      })

    })

    test('Should return new content details given a valid request', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: '1',
      })

      const newPost = {
        title: 'test test test test test test ',
        description: 'test test  test test test test test test test test test test test test test test ',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-0'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });



      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        title: newPost.title,
        type: 'post',
        slug: expect.any(String),
        description: newPost.description,
        tags: [{
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })
  })

  describe('Other people content', () => {
    test('Should return 401 when updating other person content without the content.post.update permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const newPost = {
        title: 'test test test test test test ',
        description: 'test test  test test test test test test test test test test test test test test ',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-0'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });



      expect(res.statusCode).toBe(401)
      expect(res.body).toMatchObject({
        error: 'User not authorized to perform operation on content post',
      })
    })

    test('Should return 200 when updating other person content with the content.post.update permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['USER'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'i am another user',
      })

      const newPost = {
        title: 'test test test test test test ',
        description: 'test test  test test test test test test test test test test test test test test ',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-0'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });



      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        title: newPost.title,
        type: 'post',
        slug: expect.any(String),
        description: newPost.description,
        tags: [{
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })

    test('Should return 200 when updating other person content with the content.post.admin permission', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['USER'],
      })

      getSession.mockReturnValueOnce({
        roles: ['USER'],
        id: 'definetely not me',
      })

      const newPost = {
        title: 'test test test test test test ',
        description: 'test test  test test test test test test test test test test test test test test ',
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-0'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });



      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        title: newPost.title,
        type: 'post',
        slug: expect.any(String),
        description: newPost.description,
        tags: [{
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '1',
        id: expect.anything(),
      })
    })
  })

  test('Should return 401 for a role that is PUBLIC', async () => {

    getPermissions.mockReturnValue({
      'content.post.update': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['PUBLIC'],
    })

    const newPost = {
      title: 'test',
      description: 'test test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: {
        type: 'post',
        slug: 'example-post-0'
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });



    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for ADMIN', async () => {

    getPermissions.mockReturnValue({
      'content.post.update': ['ADMIN'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
    })

    const newPost = {
      title: 'test test test test test test test test test ',
      description: 'test test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: {
        type: 'post',
        slug: 'example-post-0'
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });



    expect(res.statusCode).toBe(200)
  })

  describe('Files', () => {
    it('should call the delete file for an update removing a file', async () => {

      getPermissions.mockReturnValue({
        'content.post.update': ['ADMIN'],
        'content.post.admin': ['ADMIN'],
      })

      getSession.mockReturnValueOnce({
        roles: ['ADMIN'],
      })

      const newPost = {
        title: 'test test test test test test test test test ',
        description: 'test test test test test test test test test test test test test test test ',
        image: [],
      }

      const res = await request(handler, {
        method: 'PUT',
        query: {
          type: 'post',
          slug: 'example-post-1'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });



      expect(res.statusCode).toBe(200)
      expect(res.body).toMatchObject({
        title: newPost.title,
        type: 'post',
        slug: expect.any(String),
        description: newPost.description,
        tags: [{
            slug: 'software',
            label: 'SOFTWARE',
          },
          {
            slug: 'ai',
            label: 'AI',
          },
        ],
        image: [],
        author: '2',
        id: expect.anything(),
      })

      expect(deleteFile).toHaveBeenCalled()
    })
  })
})