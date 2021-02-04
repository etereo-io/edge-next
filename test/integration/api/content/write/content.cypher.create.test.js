import { describe, expect, test } from '@jest/globals'

import { addContent } from '@lib/api/entities/content'
import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/token'
import handler from '@pages/api/content/[type]'
import request from '../../requestHandler'

jest.mock('@lib/api/auth/token')
jest.mock('@lib/permissions/get-permissions')
jest.mock('@lib/api/entities/content')

jest.mock('@rootFolder/edge.config', () => {
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
        initialContent: mockInitialPosts,
      },

      user: {
        roles: [{ label: 'user', value: 'USER' }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for content creation with cyphered field endpoint', () => {
  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    addContent.mockReset()
  })

  beforeEach(() => {
    addContent.mockReturnValue(Promise.resolve({ id: 'abc' }))
  })

  test('Should save cyphered data#1', async () => {
    getPermissions.mockReturnValue({
      'content.post.fields.cypherField.cypher': ['USER1'],
      'content.post.create': ['USER1'],
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
      method: 'POST',
      query: { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost,
    })

    expect(addContent).toBeCalledWith(
      'post',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        type: 'post',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#1'),
      })
    )
    expect(res.statusCode).toBe(200)
  })

  test('Should save cyphered data#2', async () => {
    getPermissions.mockReturnValue({
      'content.post.fields.cypherField.cypher': ['USER1'],
      'content.post.create': ['USER1'],
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
      method: 'POST',
      query: { type: 'post' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newPost,
    })

    expect(addContent).toBeCalledWith(
      'post',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        type: 'post',
        //to make sure that we save cyphered value but not pure value
        cypherField: expect.not.stringContaining('cypherField#2'),
      })
    )
    expect(res.statusCode).toBe(200)
  })
})
