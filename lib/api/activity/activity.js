import { getDB } from '../db'

export function deleteActivity(options) {
  return getDB()
    .collection('activity')
    .remove(options)
}

export function addActivity(data) {
  return getDB()
    .collection('activity')
    .add({
      ...data,
      createdAt: Date.now(),
    })
}

export function findActivity(options, searchOptions, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
  return getDB()
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
