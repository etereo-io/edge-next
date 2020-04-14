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
    page = 0,
    pageSize = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return db
    .collection(type)
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

export function deleteContent(type, options) {}
