import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/comments'
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
      id: '1',
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

describe('Integrations tests for comment creation endpoint', () => {
 

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

   

  test('Should return 405 if required query string is missing', async () => {
    getPermissions.mockReturnValue({
      'content.post.comments.create': ['USER'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValue({
      roles: ['USER'],
      id: 'test-id',
    })

    const res = await request(handler, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {}
    });


    
    expect(res.statusCode).toBe(405)
  })

  test('Should return 405 if contentId is missing', async () => {
    

    getPermissions.mockReturnValue({
      'content.post.comments.create': ['USER'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValue({
      roles: ['USER'],
      id: 'test-id',
    })

    const res = await request(handler, {
      method: 'POST',
      query:  { contentType: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: {}
    });


    expect(res.statusCode).toBe(405)
  })

  test('Should return comment details given a valid request', async () => {
      
    getPermissions.mockReturnValue({
      'content.post.comments.create': ['USER'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValue({
      roles: ['USER'],
      id: 'test-id',
    })

    const newComment = {
      message: 'test @anotheruser test',
      conversationId: null,
    }

    const res = await request(handler, {
      method: 'POST',
      query:  { contentType: 'post', contentId: '1' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newComment,
    });


    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      contentType: 'post',
      contentId: '1',
      slug: expect.any(String),
      message: 'test [@anotheruser](/profile/@anotheruser) test',
      author: 'test-id',
      id: expect.anything(),
      user: expect.anything(),
    })
  })
})
