import { findOneUser } from '@lib/api/entities/users'
import { getDB } from '@lib/api/db'
import { ANY_OBJECT } from '@lib/types'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'

export function findOneComment(options = {}) {
  return getDB()
    .collection('comment')
    .findOne(options)
}

export function addComment(data) {
  return getDB()
    .collection('comment')
    .add(data)
    .then(async (result) => {
      const user = await findOneUser({ id: result.author })
      return {
        ...result,
        user: hidePrivateUserFields(user),
      }
    })
}

export function updateOneComment(id, data) {
  return getDB()
    .collection('comment')
    .doc(id)
    .set(data)
}

export function findComments(
  options: ANY_OBJECT = {},
  paginationOptions: ANY_OBJECT = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  return getDB()
    .collection('comment')
    .limit(limit)
    .start(from)
    .find(options, { sortBy, sortOrder })
    .then(async (data) => {
      // Fill the comments with the user information
      const users = await Promise.all(
        data.map((d) => findOneUser({ id: d.author }))
      )

      const repliesCount = await Promise.all(
        data.map((d) =>
          getDB()
            .collection('comment')
            .count({ conversationId: d.id })
        )
      )

      return {
        results: data.map((d, index) => {
          return {
            ...d,
            user: hidePrivateUserFields(users[index]),
            replies: repliesCount[index],
          }
        }),
        from,
        limit,
      }
    })
}

export function deleteComment(options) {
  return getDB()
    .collection('comment')
    .remove(options)
}

export function deleteOneComment(options) {
  return getDB()
    .collection('comment')
    .remove(options, true)
}
