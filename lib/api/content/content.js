import { getDB } from '../db'

export function findOneContent(type, options) {
  return getDB().collection(type).findOne(options)
}

export function addContent(type, data, options) {
  return getDB().collection(type).add(data)
}

export function updateOneContent(type, id, data) {
  
  return getDB()
    .collection(type)
    .doc(id)
    .set(data)
}

export function findContent(type, options = {}, searchOptions = {}, paginationOptions = {}) {
  
  const {
    from = 0,
    limit = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return getDB()
    .collection(type)
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

export function deleteContent(type, options) {}
