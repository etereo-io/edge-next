import { getDB } from '../db'

export function findOneComment(options = {}) {
  return getDB().collection('comment').findOne(options)
}

export function addComment(data) {
  return getDB().collection('comment').add(data)
}

export function updateOneComment(id, data) {
  return getDB().collection('comment').doc(id).set(data)
}

export function findComments(
  options = {},
  searchOptions = {},
  paginationOptions = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  return getDB()
    .collection('comment')
    .limit(limit)
    .start(from)
    .find(options)
    .then(async (data) => {
      // Fill the comments with the user information
      const users = await Promise.all(
        data.map((d) => getDB().collection('users').findOne({ id: d.author }))
      )

      const repliesCount = await Promise.all(
        data.map((d) =>
          getDB().collection('comment').count({ conversationId: d.id })
        )
      )

      return {
        results: data.map((d, index) => {
          return {
            ...d,
            user: users[index],
            replies: repliesCount[index],
          }
        }),
        from,
        limit,
      }
    })
}

export function deleteComment(type, options) {}
