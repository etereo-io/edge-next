import db from '../db'

export function findOneContent(type, options) {
  return db.collection(type).findOne(options)
}

export function addContent(type, data, options) {
  return db.collection(type).add(data)
}

export function updateOneContent(type, id, data) {
  
  return db
    .collection(type)
    .doc(id)
    .set(data)
}

export function findContent(type, options, searchOptions, paginationOptions) {
  const {
    from = 0,
    limit = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return db
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
