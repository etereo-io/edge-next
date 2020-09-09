import { describe, expect, test } from '@jest/globals'

import Service from '@lib/api/api-helpers/cypher-fields'
import getPermissions from '@lib/permissions/get-permissions'

jest.mock('@lib/permissions/get-permissions')

describe('Cypher service testing', () => {
  test.each([
    [
      {
        field1: 'string1',
        field2: 'string2',
        field3: 'string3',
      },
      [
        {
          name: 'field1',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
        {
          name: 'field2',
          cypher: {
            enabled: false,
          },
        },
        {
          name: 'field3',
        },
      ],
      {
        field1: expect.not.stringContaining('string1'),
        field2: expect.stringContaining('string2'),
        field3: expect.stringContaining('string3'),
      },
      {
        entity: 'group',
        type: 'project',
        user: { id: '1', roles: ['ADMIN'] },
        permissions: {
          'group.project.fields.field1.cypher': ['ADMIN'],
        },
      },
    ],
    [
      {
        field1: '<b>Some HtmlString 1</b>',
        field2: '<b>Some HtmlString 2</b>',
        field3: '<b>Some HtmlString 3</b>',
      },
      [
        {
          name: 'field1',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
        {
          name: 'field2',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
        {
          name: 'field3',
        },
      ],
      {
        field1: expect.not.stringContaining('<b>Some HtmlString 2</b>'),
        field2: expect.not.stringContaining('<b>Some HtmlString 2</b>'),
        field3: expect.stringContaining('<b>Some HtmlString 3</b>'),
      },
      {
        entity: 'content',
        type: 'post1',
        user: { id: '1', roles: ['ADMIN'] },
        permissions: {
          'content.post1.fields.field1.cypher': ['ADMIN'],
          'content.post1.fields.field2.cypher': ['ADMIN'],
        },
      },
    ],
    [
      {
        field1: '33333',
        field2: '44444',
        field3: '55555',
        field4: 'rand',
      },
      [
        {
          name: 'field1',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
        {
          name: 'field2',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
        {
          name: 'field3',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
        {
          name: 'field4',
          cypher: {
            enabled: false,
          },
        },
      ],
      {
        field1: expect.not.stringContaining('33333'),
        field2: expect.not.stringContaining('44444'),
        field3: expect.not.stringContaining('55555'),
        field4: expect.stringContaining('rand'),
      },
      {
        entity: 'user',
        type: 'profile',
        user: { id: '1', roles: ['USER'] },
        permissions: {
          'user.profile.fields.field1.cypher': ['USER'],
          'user.profile.fields.field2.cypher': ['USER'],
          'user.profile.fields.field3.cypher': ['USER'],
          'user.profile.fields.field4.cypher': ['USER'],
        },
      },
    ],
  ])(
    'Object %j has to be cyphered and deciphered correctly',
    (json, fields, expectedResult, { entity, type, user, permissions }) => {
      getPermissions.mockReturnValue(permissions)
      const isUser = entity === 'user'

      const cypheredData = Service.cypherData(fields, json)
      const [decipheredData] = Service.getDecipheredData(
        { entity, type, fields },
        [isUser ? { profile: cypheredData } : cypheredData],
        user
      )

      expect(cypheredData).toEqual(expectedResult)

      if (entity === 'user') {
        expect(decipheredData.profile).toEqual(json)
      } else {
        expect(decipheredData).toEqual(json)
      }
    }
  )

  test.each([
    [
      {
        field7: 'string7',
        field8: 'string8',
      },
      [
        {
          name: 'field7',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
        {
          name: 'field8',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
      ],
      {
        field7: expect.not.stringContaining('string7'),
        field8: expect.stringContaining('string8'),
      },
      {
        entity: 'group',
        type: 'project',
        user: { id: '1', roles: ['USER'] },
        permissions: {
          'group.project.fields.field7.cypher': ['ADMIN'],
          'group.project.fields.field8.cypher': ['USER'],
        },
      },
    ],
    [
      {
        field7: 'string7',
        field8: 'string8',
      },
      [
        {
          name: 'field7',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
        {
          name: 'field8',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
      ],
      {
        field7: expect.not.stringContaining('string7'),
        field8: expect.not.stringContaining('string8'),
      },
      {
        entity: 'content',
        type: 'post2',
        user: { id: '1', roles: ['USER'] },
        permissions: {
          'content.post2.fields.field7.cypher': ['ADMIN'],
          'content.post2.fields.field8.cypher': ['ADMIN'],
        },
      },
    ],
    [
      {
        field7: 'string7',
        field8: 'string8',
      },
      [
        {
          name: 'field7',
          cypher: {
            enabled: true,
            read: ['USER'],
          },
        },
        {
          name: 'field8',
          cypher: {
            enabled: true,
            read: ['ADMIN'],
          },
        },
      ],
      {
        field7: expect.stringContaining('string7'),
        field8: expect.not.stringContaining('string8'),
      },
      {
        entity: 'user',
        type: 'profile',
        user: { id: '1', roles: ['USER'] },
        permissions: {
          'user.profile.fields.field7.cypher': ['USER'],
          'user.profile.fields.field8.cypher': ['ADMIN'],
        },
      },
    ],
  ])(
    "Some fields of object %j don't have to be deciphered",
    (json, fields, expectedResult, { entity, type, user, permissions }) => {
      getPermissions.mockReturnValue(permissions)
      const isUser = entity === 'user'

      const cypheredData = Service.cypherData(fields, json)
      const [decipheredData] = Service.getDecipheredData(
        { entity, type, fields },
        [isUser ? { profile: cypheredData } : cypheredData],
        user
      )

      if (entity === 'user') {
        expect(decipheredData.profile).toEqual(expectedResult)
      } else {
        expect(decipheredData).toEqual(expectedResult)
      }
    }
  )
})
