import {
  deleteOneInteraction,
  findOneInteraction,
} from '@lib/api/entities/interactions'

import { getSession } from '@lib/api/auth/token'
import handler from '@pages/api/interactions/[entity]/[entity-type]/[interaction-type]'
import request from '../../requestHandler'

jest.mock('@lib/api/auth/token')
jest.mock('@lib/api/entities/interactions')

const contentEntity = 'content'
const groupEntity = 'group'
const userEntity = 'user'
const content1Type = 'post1'
const content2Type = 'post2'
const groupType = 'project'
const likeType = 'like'
const followType = 'follow'

jest.mock('@rootFolder/edge.config', () => {
  function getConfigDefault() {
    const mockPostContentType = {
      enabled: true,
      title: 'post1',
      slug: 'post1',
      permissions: {
        read: ['PUBLIC'],
      },
      comments: {
        enabled: false,
      },
      entityInteractions: [
        {
          type: 'like',
          aggregation: 'count',
          permissions: {
            delete: ['USER'],
          },
        },
        {
          type: 'follow',
          permissions: {
            delete: ['USER'],
          },
        },
      ],
    }

    const mockPost2ContentType = {
      enabled: true,
      title: 'post2',
      slug: 'post2',
      permissions: {
        read: ['USER'],
      },
      comments: {
        enabled: false,
      },
      entityInteractions: [
        {
          type: 'follow',
          permissions: {
            delete: ['ADMIN'],
          },
        },
      ],
    }

    const mockGroupType = {
      enabled: true,
      title: 'project',
      slug: 'project',
      permissions: {
        read: ['ADMIN'],
      },
      entityInteractions: [
        {
          type: 'like',
          aggregation: 'count',
          permissions: {
            delete: ['ADMIN'],
          },
        },
      ],
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
      entityInteractions: [
        {
          type: 'follow',
          permissions: {
            delete: ['USER'],
            admin: ['ADMIN'],
          },
        },
      ],
    }

    return {
      title: 'Interactions removing process',
      description: 'Interactions removing process',
      groups: {
        types: [mockGroupType],
      },
      content: {
        types: [mockPostContentType, mockPost2ContentType],
      },
      user,
    }
  }

  return {
    __esModule: true,
    getConfig: getConfigDefault,
  }
})

describe('Integrations tests for Interaction removing process', () => {
  afterEach(() => {
    getSession.mockReset()
    deleteOneInteraction.mockReset()
    findOneInteraction.mockReset()
  })

  async function fetchQuery(query) {
    return request(handler, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      query,
    })
  }

  test('User has permissions to remove content like interaction #1', async () => {
    const interactionId = 1
    const user = { id: 1, roles: ['USER'] }
    const query = {
      entity: contentEntity,
      'entity-type': content1Type,
      'interaction-type': likeType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: contentEntity,
        'entity-type': content1Type,
        'interaction-type': likeType,
        id: interactionId,
      })
    )
    deleteOneInteraction.mockReturnValue(Promise.resolve())
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })

  test('User has permissions to remove content follow interaction #1', async () => {
    const interactionId = 1
    const user = { id: 1, roles: ['USER'] }
    const query = {
      entity: contentEntity,
      'entity-type': content1Type,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: contentEntity,
        'entity-type': content1Type,
        'interaction-type': followType,
        id: interactionId,
      })
    )
    deleteOneInteraction.mockReturnValue(Promise.resolve())
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })

  test('User has permissions to remove group like interaction', async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['ADMIN'] }
    const query = {
      entity: groupEntity,
      'entity-type': groupType,
      'interaction-type': likeType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: groupEntity,
        'entity-type': groupType,
        'interaction-type': likeType,
        id: interactionId,
      })
    )
    deleteOneInteraction.mockReturnValue(Promise.resolve())
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })

  test('User has permissions to remove user follow interaction', async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['ADMIN'] }
    const query = {
      entity: userEntity,
      'entity-type': userEntity,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: userEntity,
        'entity-type': userEntity,
        'interaction-type': followType,
        id: interactionId,
      })
    )
    deleteOneInteraction.mockReturnValue(Promise.resolve())
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })

  test("User don't have permissions to remove group like interaction", async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['USER'] }
    const query = {
      entity: groupEntity,
      'entity-type': groupType,
      'interaction-type': likeType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: groupEntity,
        'entity-type': groupType,
        'interaction-type': likeType,
        id: interactionId,
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(401)
    expect(deleteOneInteraction).not.toBeCalled()
  })

  test('User has permissions to remove content 2 follow interaction', async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['ADMIN'] }
    const query = {
      entity: contentEntity,
      'entity-type': content2Type,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: contentEntity,
        'entity-type': content2Type,
        'interaction-type': followType,
        id: interactionId,
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })

  test("User doesn't have permissions to remove content 2 follow interaction", async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['USER'] }
    const query = {
      entity: contentEntity,
      'entity-type': content2Type,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({
        entity: contentEntity,
        'entity-type': content2Type,
        'interaction-type': followType,
        id: interactionId,
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(401)
    expect(deleteOneInteraction).not.toBeCalled()
  })

  test("User can't delete interaction without sending interaction id", async () => {
    const user = { id: 1, roles: ['ADMIN'] }
    const query = {
      entity: groupEntity,
      'entity-type': groupType,
      'interaction-type': likeType,
    }

    deleteOneInteraction.mockReturnValue(Promise.resolve())
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(400)
    expect(deleteOneInteraction).not.toBeCalled()
  })

  test("User can't delete non-existing interaction", async () => {
    const interactionId = 2
    const user = { id: 1, roles: ['ADMIN'] }
    const query = {
      entity: contentEntity,
      'entity-type': content2Type,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue()
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(404)
    expect(deleteOneInteraction).not.toBeCalled()
  })

  test("User can delete own interaction even if he doesn't have right for removing", async () => {
    const interactionId = 2
    const userId = 1;
    const user = { id: userId, roles: ['PUBLIC'] }
    const query = {
      entity: contentEntity,
      'entity-type': content2Type,
      'interaction-type': followType,
      id: interactionId,
    }

    findOneInteraction.mockReturnValue(Promise.resolve({
      entity: contentEntity,
      'entity-type': content2Type,
      'interaction-type': followType,
      id: interactionId,
      author: userId
    }))
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(query)

    expect(res.statusCode).toEqual(200)
    expect(deleteOneInteraction).toBeCalledWith({ id: interactionId })
  })
})
