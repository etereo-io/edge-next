import db from '../db'


export function findOneComment( options = {}) {
  return db.collection('comments').findOne(options)
}

export function addComment(data) {
  return db.collection('comments').add(data)
}

export function updateOneComment(id, data) {
  return db
    .collection('comments')
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
    .collection('comments')
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
