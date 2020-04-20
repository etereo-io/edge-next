import db from '../db'

export function addActivity(data) {
  return db.collection('activity').add({
    ...data,
    createdAt: Date.now()
  })
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
