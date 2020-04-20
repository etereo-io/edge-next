import db from '../db'

export function findOneComment( options = {}) {
  return db.collection('comment').findOne(options)
}

export function addActivity(data) {
  return db.collection('activity').add(data)
}

export function updateOneActivity(id, data) {
  return db
    .collection('activity')
    .doc(id)
    .set(data)
}

export function findActivity(options, searchOptions, paginationOptions) {
  const {
    from = 0,
    limit = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return db
    .collection('activity')
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

export function deleteActivity(type, options) {}
