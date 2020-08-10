import {
  findOneContent,
  updateOneContent,
} from '../../../../../lib/api/entities/content/content'

import { findOneUser } from '../../../../../lib/api/entities/users/user'

import { apiResolver } from 'next/dist/next-server/server/api-utils'
import fetch from 'isomorphic-unfetch'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/groups/[type]/[slug]/users'
import http from 'http'
import listen from 'test-listen'
import getPermissions from '../../../../../lib/permissions/get-permissions'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content/content')
jest.mock('../../../../../lib/api/entities/users/user')
jest.mock('../../../../../lib/api/storage')

jest.mock('../../../../../edge.config', () => {
  const groupType = 'project'
  const mockGroupType = {
    title: 'Project',

    slug: groupType,

    slugGeneration: ['title', 'createdAt'],

    publishing: {
      draftMode: true,
    },

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
        name: 'images',
        multiple: true,
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
      },
    ],

    user: {
      requireApproval: true,
      permissions: {
        join: ['USER'],
        update: ['ADMIN'],
        create: ['ADMIN'],
      },
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
        permissions: {},

        roles: [{ label: 'user', value: 'USER' }],
        newUserRoles: ['USER'],
      },
    }),
  }
})

describe('Integrations tests for joining to the group', () => {
  const groupType = 'project'
  const groupSlug = 'group-1'
  let urlToBeUsed = ''
  let server
  let url

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(req, res, undefined, handler)
    )
    url = await listen(server)

    urlToBeUsed = new URL(url)
    const params = { type: groupType, slug: groupSlug }

    Object.keys(params).forEach((key) =>
      urlToBeUsed.searchParams.append(key, params[key])
    )

    done()
  })

  afterAll((done) => {
    server.close(done)
  })

  beforeEach(() => {
    // group to user has to be added to
    findOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        members: [
          {
            id: 'user2',
          },
          {
            id: 'user3',
          },
        ],
        pendingMembers: [
          {
            id: 'user4',
          },
          {
            id: 'user5',
          },
        ],
      })
    )

    // user for event
    findOneUser.mockReturnValue(
      Promise.resolve({
        email: 'test@test.test',
      })
    )

    getPermissions.mockReturnValue({
      [`group.${groupType}.user.join`]: ['USER'],
      [`group.${groupType}.user.update`]: ['GROUP_ADMIN'],
      [`group.${groupType}.admin`]: ['ADMIN'],
    })
  })

  afterEach(() => {
    updateOneContent.mockReset()
    findOneContent.mockReset()
    getPermissions.mockReset()
    getSession.mockReset()
    findOneUser.mockReset()
  })

  async function fetchQuery(body) {
    return fetch(urlToBeUsed.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  test('User with the same id as in the body has to be added to the pending members list', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        pendingMembers: [{ id: 'user1' }, { id: 'user5' }, { id: 'user1' }],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })

    const memberBody = {
      id: 'user1',
    }

    const response = await fetchQuery(memberBody)

    expect(response.status).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      pendingMembers: [{ id: 'user4' }, { id: 'user5' }, { id: 'user1' }],
    })
  })

  test('User with the same id as in the body but without permitted role cant be added to the pending members list', async () => {
    updateOneContent.mockReturnValue({})

    getSession.mockReturnValueOnce({
      roles: ['SOME_OTHER_ROLE'],
      id: 'user4',
    })

    const memberBody = {
      id: 'user4',
    }

    const response = await fetchQuery(memberBody)

    expect(response.status).toEqual(401)
  })

  test('User with the same id as in the body has to be added to the pending members list if user isnt already in the pending list', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        pendingMembers: [{ id: 'user4' }, { id: 'user5' }],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user4',
    })

    const memberBody = {
      id: 'user4',
    }

    const response = await fetchQuery(memberBody)

    expect(response.status).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      pendingMembers: [{ id: 'user4' }, { id: 'user5' }],
    })
  })

  test('User with update permission can add users straight to the members list', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        members: [{ id: 'user2' }, { id: 'user3' }],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['GROUP_ADMIN'],
      id: 'user1',
    })

    const memberBody = {
      id: 'user6',
    }

    const response = await fetchQuery(memberBody)

    expect(response.status).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      members: [{ id: 'user2' }, { id: 'user3' }, { id: 'user6' }],
    })
  })

  test('User with update permission can add a lot of users straight to the members list by passing array', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        members: [{ id: 'user2' }, { id: 'user3' }],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['GROUP_ADMIN'],
      id: 'user1',
    })

    const memberBody = [{ id: 'user6' }, { id: 'user7' }]

    const response = await fetchQuery(memberBody)

    expect(response.status).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      members: [
        { id: 'user2' },
        { id: 'user3' },
        { id: 'user6' },
        { id: 'user7' },
      ],
    })
  })
})
