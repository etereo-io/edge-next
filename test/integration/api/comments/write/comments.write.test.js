import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/comments'
import http from 'http'
import listen from 'test-listen'

jest.mock('../../../../../lib/api/auth/iron')
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
    }),
  }
})

describe('Integrations tests for comment creation endpoint', () => {
  let server
  let url

  afterEach(() => {
    getPermissions.mockClear()
    getSession.mockClear()
  })

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handler)
    )
    url = await listen(server)

    done()
  })

  afterAll((done) => {
    server.close(done)
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(405)
  })

  test('Should return 405 if contentId is missing', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    getPermissions.mockReturnValue({
      'content.post.comments.create': ['USER'],
      'content.post.comments.admin': ['ADMIN'],
    })

    getSession.mockReturnValue({
      roles: ['USER'],
      id: 'test-id',
    })

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(405)
  })

  test('Should return comment details given a valid request', async () => {
    const urlToBeUsed = new URL(url)
    const params = { contentType: 'post', contentId: 'abc' }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

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

    const response = await fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })

    const jsonResult = await response.json()

    expect(response.status).toBe(200)
    expect(jsonResult).toMatchObject({
      contentType: 'post',
      contentId: 'abc',
      slug: expect.any(String),
      message: 'test [@anotheruser](/profile/@anotheruser) test',
      author: 'test-id',
      id: expect.anything(),
      user: expect.anything(),
    })
  })
})
