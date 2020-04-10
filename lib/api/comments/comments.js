import db from '../db'

export function findComments(type, options) {
  return db.collection('comment')
    .find({
      contentType: type,
      ...options
    })
}
