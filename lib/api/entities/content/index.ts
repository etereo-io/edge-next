import { findOneStats, findStats } from '../stats'
import { findOneUser, findUsers } from '@lib/api/entities/users'

import { ANY_OBJECT } from '@lib/types'
import { getDB } from '@lib/api/db'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'
import logger from '@lib/logger'

export function findOneContent(type: string, options) {
  
  logger('DEBUG', 'Find', type, options)
  
  return getDB()
    .collection(type)
    .findOne(options)
    .then(async (result) => {
      if (result) {
        return fillContent(result)
      } else {
        return result
      }
    })
}

export function addContent(type: string, data) {
  return getDB()
    .collection(type)
    .add(data)
    .then((result) => {
      return fillContent(result)
    })
}

export function updateOneContent(type: string, id: string, data) {
  return getDB()
    .collection(type)
    .doc(id)
    .set(data)
    .then((result) => {
      return fillContent(result)
    })
}

// Fill content to be read with data from other collections
export async function fillContent(item) {
  const comments = await getDB()
    .collection('comment')
    .count({ contentId: item.id })
  const user = await findOneUser({ id: item.author })
  const members =
    item.members && item.members.length > 0
      ? await Promise.all(
          item.members.map((member) =>
            findOneUser({ id: member.id })
              .then(hidePrivateUserFields)
              .then((user) => ({
                ...user,
                roles: member.roles,
              }))
          )
        )
      : null
  const itemStats = await findOneStats({ contentId: item.id })

  return {
    ...item,
    user: hidePrivateUserFields(user),
    comments,
    members,
    visits: itemStats ? itemStats.visits : 0
  }
}

// to prevent fetching additional data item by item; to reduce number of db requests
async function fillContentList(items) {
  const itemIds = []
  const userIds = []

  items.forEach(({ id, author, members }) => {
    itemIds.push(id)
    userIds.push(author)

    if (members) {
      userIds.push(...members.map(({ id }) => id))
    }
  })

  const users = (
    await findUsers({ id: { $in: [...new Set(userIds)] } }, { limit: 1000 })
  ).results
  const commentsList = await getDB()
    .collection('comment')
    .aggregation([
      {
        $match: { contentId: { $in: itemIds } },
      },
      { $group: { _id: '$contentId', count: { $sum: 1 } } },
    ])
    .toArray()

  const statsList = await findStats({
    contentId: { $in: [...new Set(itemIds)]}
  })

  return items.map((item) => {
    const { id, members, author } = item

    const comments = commentsList.find(({ _id: itemId }) => itemId === id)

    const user = users.find(({ id: userId }) => userId === author)
    const membersList =
      members &&
      members.length &&
      members.map(({ id: memberId, roles }) => ({
        roles,
        ...hidePrivateUserFields(
          users.find(({ id: userId }) => memberId === userId)
        ),
      }))

    const stats = statsList.find(item => item.contentId === id)

    return {
      ...item,
      user: hidePrivateUserFields(user),
      members: membersList || null,
      comments: comments ? comments.count : 0,
      visits: stats? stats.visits: 0
    }
  })
}

export async function findContent(
  type,
  options = {},
  paginationOptions: ANY_OBJECT = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection(type)
    .count(options)

  return getDB()
    .collection(type)
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder,
    })
    .then(async (data) => {
      const results = await fillContentList(data)

      return {
        results,
        from,
        limit,
        total,
      }
    })
}

export function deleteContent(type, options) {
  return getDB()
    .collection(type)
    .remove(options)
}

export function deleteOneContent(type, options) {
  return getDB()
    .collection(type)
    .remove(options, true)
}
