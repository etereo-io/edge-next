import { describe, expect, test } from '@jest/globals'

import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/iron'
import handler from '@pages/api/users'

import request from '../../requestHandler'

jest.mock('@lib/api/auth/iron')
jest.mock('@lib/permissions/get-permissions')

jest.mock('@rootFolder/edge.config', () => {
  const initialUsers = []
  const Cypher = require('@lib/api/api-helpers/cypher-fields')

  const fields = [
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
    initialUsers.push({
      id: `${i}`,
      username: `demo-${i}`,
      email: `demo${i}@demo.com`,
      profile: {
        ...Cypher.cypherData(fields, {
          cypher1: `cypher-${i}`,
          cypher2: `cypher-${i + 10}`,
          cypher3: `cypher-${i + 20}`,
        }),
      },
    })
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'Cyphered data',
      description: 'Cyphered data',
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
        profile: { fields },
        newUserRoles: ['USER'],
        initialUsers,
      },
    }),
  }
})

describe('Integrations tests for cyphered data of users endpoint', () => {
  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
  })

  test.each([
    [
      'cypher1 field have to be deciphered, cypher2 field have to be cyphered',
      {
        'user.read': ['USER'],
        'user.admin': ['ADMIN'],
        'user.profile.fields.cypher1.cypher': ['USER'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      [
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-0',
            cypher2: expect.not.stringContaining('cypher-10'),
            cypher3: 'cypher-20',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-1',
            cypher2: expect.not.stringContaining('cypher-11'),
            cypher3: 'cypher-21',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-2',
            cypher2: expect.not.stringContaining('cypher-12'),
            cypher3: 'cypher-22',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-3',
            cypher2: expect.not.stringContaining('cypher-13'),
            cypher3: 'cypher-23',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-4',
            cypher2: expect.not.stringContaining('cypher-14'),
            cypher3: 'cypher-24',
          },
        }),
      ],
    ],
    [
      'cypher1 field have to be cyphered, cypher2 field have to be cyphered',
      {
        'user.read': ['USER'],
        'user.admin': ['ADMIN'],
        'user.profile.fields.cypher1.cypher': ['ADMIN'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      [
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-0'),
            cypher2: expect.not.stringContaining('cypher-10'),
            cypher3: 'cypher-20',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-1'),
            cypher2: expect.not.stringContaining('cypher-11'),
            cypher3: 'cypher-21',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-2'),
            cypher2: expect.not.stringContaining('cypher-12'),
            cypher3: 'cypher-22',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-3'),
            cypher2: expect.not.stringContaining('cypher-13'),
            cypher3: 'cypher-23',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-4'),
            cypher2: expect.not.stringContaining('cypher-14'),
            cypher3: 'cypher-24',
          },
        }),
      ],
    ],
    [
      'cypher1 field have to be deciphered, cypher2 field have to be deciphered',
      {
        'user.read': ['USER'],
        'user.admin': ['ADMIN'],
        'user.profile.fields.cypher1.cypher': ['USER'],
        'user.profile.fields.cypher2.cypher': ['USER'],
      },
      {
        id: 'myId',
        roles: ['USER'],
      },
      [
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-0',
            cypher2: 'cypher-10',
            cypher3: 'cypher-20',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-1',
            cypher2: 'cypher-11',
            cypher3: 'cypher-21',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-2',
            cypher2: 'cypher-12',
            cypher3: 'cypher-22',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-3',
            cypher2: 'cypher-13',
            cypher3: 'cypher-23',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-4',
            cypher2: 'cypher-14',
            cypher3: 'cypher-24',
          },
        }),
      ],
    ],
  ])(
    'Some fields should be deciphered depend on role: %s',
    async (message, permissions, user, expectedResult) => {
      getPermissions.mockReturnValue(permissions)
      getSession.mockReturnValueOnce(user)

      const res = await request(handler, {
        method: 'GET',
      })

      expect(res.body.results).toEqual(expect.arrayContaining(expectedResult))
    }
  )

  test.each([
    [
      'all fields of the first user have to be deciphered',
      {
        'user.read': ['USER'],
        'user.admin': ['ADMIN'],
        'user.profile.fields.cypher1.cypher': ['ADMIN'],
      },
      {
        id: '0',
        roles: ['USER'],
      },
      [
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-0',
            cypher2: 'cypher-10',
            cypher3: 'cypher-20',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-1'),
            cypher2: expect.not.stringContaining('cypher-11'),
            cypher3: 'cypher-21',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-2'),
            cypher2: expect.not.stringContaining('cypher-12'),
            cypher3: 'cypher-22',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-3'),
            cypher2: expect.not.stringContaining('cypher-13'),
            cypher3: 'cypher-23',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-4'),
            cypher2: expect.not.stringContaining('cypher-14'),
            cypher3: 'cypher-24',
          },
        }),
      ],
    ],
    [
      'all fields of the second user have to be deciphered',
      {
        'user.read': ['USER'],
        'user.admin': ['ADMIN'],
        'user.profile.fields.cypher1.cypher': ['ADMIN'],
      },
      {
        id: '1',
        roles: ['USER'],
      },
      [
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-0'),
            cypher2: expect.not.stringContaining('cypher-10'),
            cypher3: 'cypher-20',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: 'cypher-1',
            cypher2: 'cypher-11',
            cypher3: 'cypher-21',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-2'),
            cypher2: expect.not.stringContaining('cypher-12'),
            cypher3: 'cypher-22',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-3'),
            cypher2: expect.not.stringContaining('cypher-13'),
            cypher3: 'cypher-23',
          },
        }),
        expect.objectContaining({
          profile: {
            cypher1: expect.not.stringContaining('cypher-4'),
            cypher2: expect.not.stringContaining('cypher-14'),
            cypher3: 'cypher-24',
          },
        }),
      ],
    ],
  ])(
    'Some fields should be deciphered depend on userId despite the role: %s',
    async (message, permissions, user, expectedResult) => {
      getPermissions.mockReturnValue(permissions)
      getSession.mockReturnValueOnce(user)

      const res = await request(handler, {
        method: 'GET',
      })

      expect(res.body.results).toEqual(expect.arrayContaining(expectedResult))
    }
  )
})
