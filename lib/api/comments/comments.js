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
    page = 0,
    pageSize = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return db
    .collection('comment')
    .limit(pageSize)
    .start(page * pageSize)
    .find(options)
    .then((data) => {
      return {
        data: data,
        page,
        pageSize,
      }
    })
}

export function deleteComment(type, options) {}
