import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/iron'
import handler from '@pages/api/content/[type]/[slug]'
import { updateOneContent, findOneContent } from '@lib/api/entities/content'

import request from '../../requestHandler'

jest.mock('@lib/api/auth/iron')
jest.mock('@lib/permissions/get-permissions')
jest.mock('@lib/api/entities/content')

jest.mock('@rootFolder/edge.config', () => {
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
        name: 'cypherField',
        label: 'cypherField',
        type: 'text',
        cypher: {
          enabled: true,
          read: ['USER1'],
        },
      },
    ],
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',
      content: {
        types: [mockPostContentType],
        initialContent: [],
      },

      user: {
        roles: [{ label: 'user', value: 'USER' }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for content updating with cyphered field endpoint', () => {
  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    updateOneContent.mockReset()
    findOneContent.mockReset()
  })

  beforeEach(() => {
    updateOneContent.mockReturnValue(Promise.resolve({ id: 'abc' }))
    findOneContent.mockReturnValue(Promise.resolve({ id: 'abc' }))
  })

  test('Should save cyphered data#1', async () => {
    getPermissions.mockReturnValue({
      'content.post.fields.cypherField.cypher': ['USER1'],
      'content.post.update': ['USER1'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
    })

    const newPost = {
      title: 'test#1 test#1 test#1',
      description: 'test#1 test#1 test#1 test#1',
      cypherField: 'cypherField#1',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: { type: 'post', slug: 'example-post-0' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(updateOneContent).toBeCalledWith(
      'post',
      'abc',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#1'),
      })
    )
    expect(res.statusCode).toBe(200)
  })

  test('Should save cyphered data#2', async () => {
    getPermissions.mockReturnValue({
      'content.post.fields.cypherField.cypher': ['USER1'],
      'content.post.update': ['USER1'],
      'content.post.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
    })

    const newPost = {
      title: 'test#1 test#1 test#1',
      description: 'test#1 test#1 test#1 test#1',
      cypherField: 'cypherField#2',
    }

    const res = await request(handler, {
      method: 'PUT',
      query: { type: 'post', slug: 'example-post-0' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    expect(updateOneContent).toBeCalledWith(
      'post',
      'abc',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#2'),
      })
    )
    expect(res.statusCode).toBe(200)
  })
})
