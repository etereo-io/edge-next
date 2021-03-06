import {
  findOneContent,
  updateOneContent,
} from '../../../../../lib/api/entities/content'

import { findOneUser } from '../../../../../lib/api/entities/users'
import getPermissions from '../../../../../lib/permissions/get-permissions'
import { getSession } from '../../../../../lib/api/auth/iron'
import handler from '../../../../../pages/api/groups/[type]/[slug]/users/[userId]'
import request from '../../requestHandler'

jest.mock('../../../../../lib/api/auth/iron')
jest.mock('../../../../../lib/permissions/get-permissions')
jest.mock('../../../../../lib/api/entities/content')
jest.mock('../../../../../lib/api/entities/users')
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

    roles: [
      {
        label: 'Group Member',
        value: 'GROUP_MEMBER',
      },
      {
        label: 'Group admin',
        value: 'GROUP_ADMIN',
      },
    ],

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
        delete: ['GROUP_ADMIN', 'GROUP_ADMIN'],
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

describe('Integrations tests for group user removing', () => {
  const groupType = 'project'
  const groupSlug = 'group-1'
    
  const params = { type: groupType, slug: groupSlug }

  beforeEach(() => {

    // group to user has to be added to
    findOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        members: [
          { id: 'user1', roles: ['GROUP_ADMIN'] },
          { id: 'user2', roles: ['GROUP_MEMBER'] },
          { id: 'user3', roles: ['GROUP_ADMIN'] },
        ],
        pendingMembers: [
          { id: 'user4', roles: ['GROUP_MEMBER'] },
          { id: 'user5', roles: ['GROUP_MEMBER'] },
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
      [`group.${groupType}.user.delete`]: ['ADMIN', 'GROUP_ADMIN'],
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

  async function fetchQuery(userId) {
    const res = await request(handler, {
      method: 'DELETE',
      query:  {
        ...params,
        userId
      },
      headers: {
        'Content-Type': 'application/json',
      }
    })

    return res
  }

  test('User with group admin role remove member 2', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        pendingMembers: [
          { id: 'user4', roles: ['GROUP_MEMBER'] },
          { id: 'user5', roles: ['GROUP_MEMBER'] },
        ],
        members: [{ id: 'user1', roles: ['GROUP_ADMIN'] }, { id: 'user3', roles: ['GROUP_ADMIN']}],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })

    const res = await fetchQuery('user2')

    expect(res.statusCode).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      pendingMembers: [
        { id: 'user4', roles: ['GROUP_MEMBER'] },
        { id: 'user5', roles: ['GROUP_MEMBER'] },
      ],
      members: [{ id: 'user1', roles: ['GROUP_ADMIN'] }, { id: 'user3', roles: ['GROUP_ADMIN']}],
    })
  })

  test('User with group admin role remove member 4', async () => {
    updateOneContent.mockReturnValue(
      Promise.resolve({
        slug: groupSlug,
        id: groupSlug,
        pendingMembers: [{ id: 'user5', roles: ['GROUP_MEMBER'] }],
        members: [
          { id: 'user1', roles: ['GROUP_ADMIN'] },
          { id: 'user2', roles: ['GROUP_MEMBER'] },
          { id: 'user3', roles: ['GROUP_ADMIN'] },
        ],
      })
    )

    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user1',
    })

    const res = await fetchQuery('user4')

    expect(res.statusCode).toEqual(200)
    expect(updateOneContent).toHaveBeenCalledWith(groupType, groupSlug, {
      pendingMembers: [{ id: 'user5', roles: ['GROUP_MEMBER'] }],
      members: [
        { id: 'user1', roles: ['GROUP_ADMIN']},
        { id: 'user2', roles: ['GROUP_MEMBER'] },
        { id: 'user3', roles: ['GROUP_ADMIN'] },
      ],
    })
  })

  test('User without permitted role cannot remove member 4', async () => {
    getSession.mockReturnValueOnce({
      roles: ['USER'],
      id: 'user2',
    })

    const res = await fetchQuery('user4')

    expect(res.statusCode).toEqual(401)
    expect(updateOneContent).not.toHaveBeenCalled()
  })
})
