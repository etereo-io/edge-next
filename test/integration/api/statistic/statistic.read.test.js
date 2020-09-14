import { describe, expect, test } from '@jest/globals'

import getPermissions from '@lib/permissions/get-permissions'
import { getSession } from '@lib/api/auth/iron'
import handler from '@pages/api/statistic'

import request from '../requestHandler'

jest.mock('@lib/api/auth/iron')
jest.mock('@lib/permissions/get-permissions')

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
      title: 'post2',
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
      title: 'A Statistic test',
      description: 'A Statistic test',

      groups: {
        types: [mockGroupType],
      },

      content: {
        types: [mockPostContentType, mockPost2ContentType],
      },

      admin: {
        permissions: {
          stats: ['ADMIN'],
        },
      },

      statistic: {
        users: {
          enabled: true,
          title: 'Users',
        },
        content: [
          {
            // any other configuration will be placed here
            name: mockPostContentType.slug,
            title: mockPostContentType.title,
          },
          {
            // any other configuration will be placed here
            name: mockPost2ContentType.slug,
            title: mockPost2ContentType.title,
          },
        ],
        groups: [
          {
            // any other configuration will be placed here
            name: mockGroupType.slug,
            title: mockGroupType.title,
          },
        ],
      },

      user,
    }
  }

  return {
    __esModule: true,
    getConfig: getConfigDefault,
  }
})

describe('Integrations tests for Statistic', () => {
  afterEach(() => {
    getSession.mockReset()
    getPermissions.mockReset()
  })
  beforeEach(() => {
    getPermissions.mockReturnValue({ 'admin.stats': ['ADMIN'] })
  })

  async function fetchQuery() {
    return request(handler, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  test('User has a correct role', async () => {
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['ADMIN'] }))

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(200)
  })

  test("User doesn't have a correct role", async () => {
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['USER'] }))

    const res = await fetchQuery()

    expect(res.statusCode).toEqual(401)
  })

  test('Response has a correct structure', async () => {
    getSession.mockReturnValue(Promise.resolve({ id: 1, roles: ['ADMIN'] }))

    const res = await fetchQuery()

    expect(res.body).toEqual({
      data: {
        content: [
          {
            title: 'post',
            todayTotal: expect.any(Number),
            total: expect.any(Number),
            yesterdayTotal: expect.any(Number),
          },
          {
            title: 'post2',
            todayTotal: expect.any(Number),
            total: expect.any(Number),
            yesterdayTotal: expect.any(Number),
          },
        ],
        groups: [
          {
            title: 'project',
            todayTotal: expect.any(Number),
            total: expect.any(Number),
            yesterdayTotal: expect.any(Number),
          },
        ],
        users: [
          {
            title: 'Users',
            todayTotal: expect.any(Number),
            total: expect.any(Number),
            yesterdayTotal: expect.any(Number),
          },
        ],
      },
    })
  })
})
