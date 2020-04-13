import db from '../db'

export function findOneContent(type, options) {
  return db.collection(type).findOne(options)
}

export function addContent(type, data, options) {
  return db.collection(type).add(data)
}

export function updateContent(type, data, options) {}

export function findContent(type, options, searchOptions, paginationOptions) {
  const {
    page = 0,
    pageSize = 15,
    sortBy,
    sortOrder = 'DESC',
  } = paginationOptions
  return db
    .collection(type)
    .limit(pageSize * (page + 1))
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
