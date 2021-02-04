import { describe, expect, test } from '@jest/globals'

import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/token'
import handler from '@pages/api/groups/[type]/[slug]'
import request from '../../requestHandler'

jest.mock('@lib/api/auth/token')
jest.mock('@lib/permissions/get-permissions')

jest.mock('@rootFolder/edge.config', () => {
  const mockInitialGroups = []
  const Cypher = require('@lib/api/api-helpers/cypher-fields')

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      title: true,
      placeholder: 'Title',
    },
    {
      name: 'cypher1',
      type: 'text',
      label: 'cypher1',
      cypher: {
        enabled: true,
        read: ['USER'],
      },
    },
    {
      name: 'cypher2',
      type: 'text',
      label: 'cypher2',
      cypher: {
        enabled: true,
        read: ['ADMIN'],
      },
    },
    {
      name: 'cypher3',
      type: 'text',
      label: 'cypher3',
      cypher: {
        enabled: false,
      },
    },
  ]

  for (let i = 0; i < 5; i++) {
    mockInitialGroups.push({
      type: 'project',
      id: i,
      author: `${i + 5}`,
      draft: false,
      title: 'Example project',
      slug: `example-project-${i}`,
      ...Cypher.cypherData(fields, {
        cypher1: `cypher-${i}`,
        cypher2: `cypher-${i + 10}`,
        cypher3: `cypher-${i + 20}`,
      }),
    })
  }

  const mockGroup = {
    title: 'Project',
    slug: 'project',
    slugGeneration: ['title', 'createdAt'],
    permissions: {
      read: ['PUBLIC', 'USER'],
      create: ['ADMIN', 'USER'],
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },
    publishing: {
      draftMode: true,
    },
    comments: {
      enabled: false,
    },
    fields,
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'Cyphered data',
      description: 'Cyphered data',
      groups: {
        types: [mockGroup],
        initialGroups: mockInitialGroups,
      },

      user: {
        roles: [
          {
            label: 'user',
            value: 'USER',
          },
          {
            label: 'Admin',
            value: 'ADMIN',
          },
        ],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for cyphered data of one group endpoint', () => {
  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

  test.each([
    [
      'cypher1 field have to be deciphered, cypher2 field have to be cyphered',
      {
        'group.project.read': ['USER'],
        'group.project.admin': ['ADMIN'],
        'group.project.fields.cypher1.cypher': ['USER'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      'example-project-0',
      {
        cypher1: 'cypher-0',
        cypher2: expect.not.stringContaining('cypher-10'),
        cypher3: 'cypher-20',
      },
    ],
    [
      'cypher1 field have to be cyphered, cypher2 field have to be cyphered',
      {
        'group.project.read': ['USER'],
        'group.project.admin': ['ADMIN'],
        'group.project.fields.cypher1.cypher': ['ADMIN'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      'example-project-2',

      {
        cypher1: expect.not.stringContaining('cypher-2'),
        cypher2: expect.not.stringContaining('cypher-12'),
        cypher3: 'cypher-22',
      },
    ],
    [
      'cypher1 field have to be deciphered, cypher2 field have to be deciphered',
      {
        'group.project.read': ['USER'],
        'group.project.admin': ['ADMIN'],
        'group.project.fields.cypher1.cypher': ['USER'],
        'group.project.fields.cypher2.cypher': ['USER'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      'example-project-3',
      {
        cypher1: 'cypher-3',
        cypher2: 'cypher-13',
        cypher3: 'cypher-23',
      },
    ],
  ])(
    'Some fields should be deciphered depend on role: %s',
    async (message, permissions, user, slug, expectedResult) => {
      getPermissions.mockReturnValue(permissions)
      getSession.mockReturnValueOnce(user)

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'project',
          slug,
        },
      })

      expect(res.body).toEqual(expect.objectContaining(expectedResult))
    }
  )

  test.each([
    [
      'all fields of the first group have to be deciphered',
      {
        'group.project.read': ['USER'],
      },
      {
        id: '5',
        roles: ['USER'],
      },
      'example-project-0',
      {
        cypher1: 'cypher-0',
        cypher2: 'cypher-10',
      },
    ],
    [
      'all fields of the second group have to be deciphered',
      {
        'group.project.read': ['USER'],
      },
      {
        id: '6',
        roles: ['USER'],
      },
      'example-project-1',
      {
        cypher1: 'cypher-1',
        cypher2: 'cypher-11',
      },
    ],
  ])(
    'Some fields should be deciphered depend on authorId despite the role: %s',
    async (message, permissions, user, slug, expectedResult) => {
      getPermissions.mockReturnValue(permissions)
      getSession.mockReturnValueOnce(user)

      const res = await request(handler, {
        method: 'GET',
        query: {
          type: 'project',
          slug,
        },
      })

      expect(res.body).toEqual(expect.objectContaining(expectedResult))
    }
  )
})
