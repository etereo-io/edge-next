import { findAll } from '@lib/api/entities/superSearch'
import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/token'
import handler from '@pages/api/super-search'
import request from '../requestHandler'

jest.mock('@lib/api/auth/token')
jest.mock('@lib/permissions/get-permissions')
jest.mock('@lib/api/entities/superSearch')

jest.mock('@rootFolder/edge.config', () => {
  function getConfigDefault() {
    const mockPostContentType = {
      enabled: true,
      title: 'post',
      slug: 'post',
      permissions: {
        read: ['USER'],
      },
      comments: {
        enabled: false,
      },
    }

    const mockPost2ContentType = {
      enabled: true,
      title: 'post',
      slug: 'post2',
      permissions: {
        read: ['ADMIN'],
      },
      comments: {
        enabled: false,
      },
    }

    const mockGroupType = {
      enabled: true,
      title: 'project',
      slug: 'project',

      permissions: {
        read: ['ADMIN'],
      },
    }

    const user = {
      permissions: { read: ['PUBLIC'], admin: ['ADMIN'] },

      roles: [
        {
          label: 'user',
          value: 'USER',
        },
      ],
      newUserRoles: ['USER'],
    }

    return {
      title: 'A test',
      description: 'A test',

      groups: {
        types: [mockGroupType],
      },

      content: {
        types: [mockPostContentType, mockPost2ContentType],
      },

      user,

      superSearch: {
        enabled: true,
        permissions: { read: ['USER'] },
        entities: [
          {
            name: 'users',
            type: 'user',
            fields: ['username'],
            fieldsForShow: ['username', 'id'],
            permissions: ['PUBLIC'],
          },
          {
            name: mockGroupType.slug,
            type: 'group',
            fields: ['title', 'description'],
            fieldsForShow: ['title', 'description', 'slug', 'type'],
            permissions: mockGroupType.permissions.read,
          },
          {
            name: mockPostContentType.slug,
            type: 'content',
            fields: ['title', 'description'],
            fieldsForShow: [
              'title',
              'slug',
              'description',
              'groupId',
              'groupType',
              'type',
            ],
            permissions: mockPostContentType.permissions.read,
          },
          {
            name: mockPost2ContentType.slug,
            type: 'content',
            fields: ['title', 'description'],
            fieldsForShow: [
              'title',
              'slug',
              'description',
              'groupId',
              'groupType',
              'type',
            ],
            permissions: mockPost2ContentType.permissions.read,
          },
        ],
      },
    }
  }

  return {
    __esModule: true,
    getConfig: getConfigDefault,
  }
})

describe('Integrations tests for SuperSearch', () => {
  afterEach(() => {
    getSession.mockReset()
    getPermissions.mockReset()
    findAll.mockReset()
  })

  async function fetchQuery(query = '') {
    return request(handler, {
      method: 'GET',
      query: { query },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const commonPermissions = {
    'content.post.read': ['USER'],
    'content.post2.read': ['ADMIN'],
    'group.project.read': ['ADMIN'],
    'user.read': ['USER'],
    'user.admin': ['ADMIN'],
  }

  const publicPermissions = {
    ...commonPermissions,
    'superSearch.read': ['PUBLIC'],
  }

  const userPermissions = {
    ...commonPermissions,
    'superSearch.read': ['USER'],
  }

  test('User has a correct role', async () => {
    getPermissions.mockReturnValue(userPermissions)
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['USER'] }))

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(200)
  })

  test("User doesn't have a correct role", async () => {
    getPermissions.mockReturnValue(userPermissions)
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['PUBLIC'] }))

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(401)
  })

  test('User has an admin role', async () => {
    getPermissions.mockReturnValue(userPermissions)
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['ADMIN'] }))

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(200)
  })

  test('Empty string is restricted', async () => {
    getPermissions.mockReturnValue(publicPermissions)
    getSession.mockReturnValue()

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(200)
    expect(findAll).not.toHaveBeenCalled()
  })

  test("User isn't authorized. Only public entities should be retrieved", async () => {
    getPermissions.mockReturnValue(publicPermissions)
    getSession.mockReturnValue()

    const res = await fetchQuery('q')

    expect(res.statusCode).toEqual(200)
    expect(findAll).toHaveBeenCalledWith([
      { name: 'users', options: { $or: [{ username: /q/gi }] }, type: 'user' },
    ])
  })

  test('User#1 has an user role', async () => {
    getPermissions.mockReturnValue(publicPermissions)
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['USER'] }))

    const res = await fetchQuery('q')

    expect(res.statusCode).toEqual(200)
    expect(findAll).toHaveBeenCalledWith([
      { name: 'users', options: { $or: [{ username: /q/gi }] }, type: 'user' },
      {
        name: 'project',
        options: {
          $or: [{ title: /q/gi }, { description: /q/gi }],
          members: { $elemMatch: { id: 1 } },
        },
        type: 'group',
      },
      {
        name: 'post',
        options: { $or: [{ title: /q/gi }, { description: /q/gi }] },
        type: 'content',
      },
    ])
  })

  test('User#2 has an user role', async () => {
    getPermissions.mockReturnValue(publicPermissions)
    getSession.mockReturnValue(
      Promise.resolve({ id: 'someID', roles: ['USER'] })
    )

    const res = await fetchQuery('some title')

    expect(res.statusCode).toEqual(200)
    expect(findAll).toHaveBeenCalledWith([
      {
        name: 'users',
        options: { $or: [{ username: /some title/gi }] },
        type: 'user',
      },
      {
        name: 'project',
        options: {
          $or: [{ title: /some title/gi }, { description: /some title/gi }],
          members: { $elemMatch: { id: 'someID' } },
        },
        type: 'group',
      },
      {
        name: 'post',
        options: {
          $or: [{ title: /some title/gi }, { description: /some title/gi }],
        },
        type: 'content',
      },
    ])
  })

  test('User#3 has an admin role', async () => {
    getPermissions.mockReturnValue(publicPermissions)
    getSession.mockReturnValue(
      Promise.resolve({ id: 'adminID', roles: ['ADMIN'] })
    )

    const res = await fetchQuery('some secret title')

    expect(res.statusCode).toEqual(200)
    expect(findAll).toHaveBeenCalledWith([
      {
        name: 'users',
        options: { $or: [{ username: /some secret title/gi }] },
        type: 'user',
      },
      {
        name: 'project',
        options: {
          $or: [
            { title: /some secret title/gi },
            { description: /some secret title/gi },
          ],
        },
        type: 'group',
      },
      {
        name: 'post',
        options: {
          $or: [
            { title: /some secret title/gi },
            { description: /some secret title/gi },
          ],
        },
        type: 'content',
      },
      {
        name: 'post2',
        options: {
          $or: [
            { title: /some secret title/gi },
            { description: /some secret title/gi },
          ],
        },
        type: 'content',
      },
    ])
  })
})
