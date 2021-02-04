import { addContent } from '../../../../../lib/api/entities/content'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/token'
import handler from '../../../../../pages/api/groups/[type]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/token')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content')

jest.mock('../../../../../edge.config', () => {
  const mockGroupType = {
    title: 'Project',

    slug: 'project',

    slugGeneration: ['title', 'createdAt'],

    publishing: {
      draftMode: true,
    },

    roles: [
      {
        label: 'Group member',
        value: 'GROUP_MEMBER',
      },
      {
        label: 'Group admin',
        value: 'GROUP_ADMIN',
      },
    ],

    permissions: {
      read: ['PUBLIC'],
      create: ['ADMIN', 'USER'],
      update: ['ADMIN'],
      delete: ['ADMIN'],
      admin: ['ADMIN'],
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        title: true,
        minlength: 2,
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
        name: 'cypherField',
        label: 'cypherField',
        type: 'text',
        cypher: {
          enabled: true,
          read: ['USER1'],
        },
      },
    ],

    user: {
      permissions: {},
    },
  }

  return {
    __esModule: true,
    getConfig: jest.fn().mockReturnValue({
      title: 'A test',
      description: 'A test',

      groups: {
        types: [mockGroupType],
      },

      user: {
        roles: [{ label: 'user', value: 'USER' }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for Groups creation endpoint', () => {
  beforeEach(() => {
    addContent.mockReturnValue(Promise.resolve({ id: 'abc' }))
  })

  afterEach(() => {
    getPermissions.mockReset()
    getSession.mockReset()
    addContent.mockReset()
  })

  test('Should return 405 if required query string is missing', async () => {
    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-id-initial-user',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toEqual(405)
  })

  test('Should return 405 if group type is invalid', async () => {
    const params = { type: 'classroom' }

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-another-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(405)
  })

  test('Should return 400 if group validation fails', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'test-some-id',
    })

    const newGroup = {
      title: 's',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({
      error: 'Invalid data: title length is less than 2',
    })
  })

  test('Should return 200 for a role that is allowed', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['USER'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'allowed-user',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if it does not have permissions to create group', async () => {
    getPermissions.mockReturnValue({
      'group.project.create': ['ANOTHER_ROLE', 'OTHER_STUFF'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['SAN BENITOP'],
      id: 'test-id',
    })

    const params = { type: 'project' }

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(401)
  })

  test('Should return 200 for admin when creating group', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 401 if the member role is invalid', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
      members: [
        {
          roles: ['GROUP_OTHER_STUFF'],
          id: 'abc',
        },
      ],
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(400)
  })

  test('Should return 200 if the member role is valid', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
      members: [
        {
          roles: ['GROUP_MEMBER'],
          id: 'abc',
        },
      ],
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(200)
  })

  test('Should return 400 if the member role is invalid', async () => {
    const params = { type: 'project' }

    getPermissions.mockReturnValue({
      'group.project.create': ['ADMIN'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['ADMIN'],
      id: 'test-id',
    })

    const newGroup = {
      title: 'tes',
      description:
        'test test  test test test test test test test test test test test test test test ',
      members: [
        {
          roles: ['GROUP_MEMBERSSSS'],
          id: 'abc',
        },
      ],
    }

    const res = await request(handler, {
      method: 'POST',
      query: params,
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(res.statusCode).toBe(400)
  })

  test('Should save cyphered data#1', async () => {
    getPermissions.mockReturnValue({
      'group.project.fields.cypherField.cypher': ['USER1'],
      'group.project.create': ['USER1'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
    })

    const newGroup = {
      title: 'test#1 test#1 test#1',
      description: 'test#1 test#1 test#1 test#1',
      cypherField: 'cypherField#1',
    }

    const res = await request(handler, {
      method: 'POST',
      query: { type: 'project' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(addContent).toBeCalledWith(
      'project',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        type: 'project',
      })
    )
    // to make sure that we save cyphered value but not pure value
    expect(addContent).not.toBeCalledWith(
      'project',
      expect.objectContaining({
        cypherField: 'cypherField#1',
      })
    )
    expect(res.statusCode).toBe(200)
  })

  test('Should save cyphered data#2', async () => {
    getPermissions.mockReturnValue({
      'group.project.fields.cypherField.cypher': ['USER1'],
      'group.project.create': ['USER1'],
      'group.project.admin': ['ADMIN'],
    })

    getSession.mockReturnValueOnce({
      roles: ['USER1'],
    })

    const newGroup = {
      title: 'test#1 test#1 test#1',
      description: 'test#1 test#1 test#1 test#1',
      cypherField: 'cypherField#2',
    }

    const res = await request(handler, {
      method: 'POST',
      query: { type: 'project' },
      headers: {
        'Content-Type': 'application/json',
      },
      body: newGroup,
    })

    expect(addContent).toBeCalledWith(
      'project',
      expect.objectContaining({
        description: 'test#1 test#1 test#1 test#1',
        title: 'test#1 test#1 test#1',
        type: 'project',
      })
    )
    // to make sure that we save cyphered value but not pure value
    expect(addContent).not.toBeCalledWith(
      'project',
      expect.objectContaining({
        cypherField: 'cypherField#2',
      })
    )

    expect(res.statusCode).toBe(200)
  })
})
