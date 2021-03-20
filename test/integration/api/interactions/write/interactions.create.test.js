import {
  createInteraction,
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
            create: ['USER'],
          },
        },
        {
          type: 'follow',
          permissions: {
            create: ['USER'],
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
            create: ['ADMIN'],
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
            create: ['ADMIN'],
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
            create: ['USER'],
          },
        },
      ],
    }

    return {
      title: 'Interactions creation process',
      description: 'Interactions creation process',
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

describe('Integrations tests for Interaction creation process', () => {
  afterEach(() => {
    getSession.mockReset()
    findOneInteraction.mockReset()
    createInteraction.mockReset()
  })

  async function fetchQuery(body = {}) {
    return request(handler, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
  }

  test('User has permissions to follow content #1', async () => {
    const userId = 1
    const user = { id: userId, roles: ['USER'] }
    const body = {
      entityId: 2,
      entity: contentEntity,
      entityType: content1Type,
      type: followType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: contentEntity,
        entityType: content1Type,
        type: followType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(200)
    expect(createInteraction).toBeCalledWith({
      author: userId,
      ...body,
    })
  })

  test('User has permissions to like content #1', async () => {
    const userId = 1
    const user = { id: userId, roles: ['USER'] }
    const body = {
      entityId: 2,
      entity: contentEntity,
      entityType: content1Type,
      type: likeType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: contentEntity,
        entityType: content1Type,
        type: likeType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(200)
    expect(createInteraction).toBeCalledWith({
      author: userId,
      ...body,
    })
  })

  test('User has permissions to follow content #2', async () => {
    const userId = 2
    const user = { id: userId, roles: ['ADMIN'] }
    const body = {
      entityId: 2,
      entity: contentEntity,
      entityType: content2Type,
      type: followType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: contentEntity,
        entityType: content2Type,
        type: followType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(200)
    expect(createInteraction).toBeCalledWith({
      author: userId,
      ...body,
    })
  })

  test("User can't create interaction that not in the config", async () => {
    const userId = 2
    const user = { id: userId, roles: ['ADMIN'] }
    const body = {
      entityId: 2,
      entity: contentEntity,
      entityType: content2Type,
      type: likeType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: contentEntity,
        entityType: content2Type,
        type: likeType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(400)
    expect(createInteraction).not.toBeCalled()
  })

  test('User doesnt have permissions to like the content #2', async () => {
    const userId = 3
    const user = { id: userId, roles: ['PUBLIC'] }
    const body = {
      entityId: 2,
      entity: contentEntity,
      entityType: content1Type,
      type: followType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: contentEntity,
        entityType: content1Type,
        type: followType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(401)
    expect(createInteraction).not.toBeCalled()
  })

  test('User has permissions to like group', async () => {
    const userId = 4
    const user = { id: userId, roles: ['ADMIN'] }
    const body = {
      entityId: 2,
      entity: groupEntity,
      entityType: groupType,
      type: likeType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: groupEntity,
        entityType: groupType,
        type: likeType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(200)
    expect(createInteraction).toBeCalledWith({
      author: userId,
      ...body,
    })
  })

  test("User doesn't have permissions to like group", async () => {
    const userId = 5
    const user = { id: userId, roles: ['USER'] }
    const body = {
      entityId: 2,
      entity: groupEntity,
      entityType: groupType,
      type: likeType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: groupEntity,
        entityType: groupType,
        type: likeType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(401)
    expect(createInteraction).not.toBeCalled()
  })

  test('User has permissions to follow user', async () => {
    const userId = 5
    const user = { id: userId, roles: ['USER'] }
    const body = {
      entityId: 2,
      entity: userEntity,
      entityType: userEntity,
      type: followType,
    }

    findOneInteraction.mockReturnValue(Promise.resolve(false))
    createInteraction.mockReturnValue(
      Promise.resolve({
        entityId: 2,
        entity: userEntity,
        entityType: userEntity,
        type: followType,
        createdAt: new Date(),
      })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(200)
    expect(createInteraction).toBeCalledWith({
      author: userId,
      ...body,
    })
  })

  test("User can't create already existing interaction", async () => {
    const userId = 5
    const user = { id: userId, roles: ['USER'] }
    const body = {
      entityId: 2,
      entity: userEntity,
      entityType: userEntity,
      type: followType,
    }

    findOneInteraction.mockReturnValue(
      Promise.resolve({ entityId: 2, entity: userEntity, type: followType })
    )
    getSession.mockReturnValue(Promise.resolve(user))

    const res = await fetchQuery(body)

    expect(res.statusCode).toEqual(400)
    expect(createInteraction).not.toBeCalled()
  })
})
