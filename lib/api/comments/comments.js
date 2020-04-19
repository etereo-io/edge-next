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
    .then((data) => {
      return {
        results: data,
        from,
        limit,
      }
    })
}

export function deleteComment(type, options) {}
