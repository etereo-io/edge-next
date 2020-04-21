import db from '../db'

export function findOneComment( options = {}) {
  return db.collection('comment').findOne(options)
}

export function addComment(data) {
  return db.collection('comment').add(data)
}

export function updateOneComment(id, data) {
  return db
    .collection('comment')
    .doc(id)
    .set(data)
}

export function findComments(options, searchOptions, paginationOptions) {
  const {
    from = 0,
    limit = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions

  return db
    .collection('comment')
    .limit(limit)
    .start(from)
    .find(options)
    .then(async (data) => {

      // Fill the comments with the user information
      const users = await Promise.all(data.map(d => db.collection('users').findOne({id: d.author})))

      return {
        results: data.map((d, index)=> {
          return {
            ...d,
            user: users[index]
          }
        }),
        from,
        limit,
      }
    })
}

export function deleteComment(type, options) {}
