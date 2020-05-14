import { getDB } from '../db'

export function findOneContent(type, options) {
  return getDB().collection(type).findOne(options)
}

export function addContent(type, data, options) {
  return getDB().collection(type).add(data)
}

export function updateOneContent(type, id, data) {
  return getDB().collection(type).doc(id).set(data)
}

export async function findContent(
  type,
  options = {},
  searchOptions = {},
  paginationOptions = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
  return getDB()
    .collection(type)
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder
    })
    .then(async (data) => {
      // Fill the content with the comments information
      const commentsCount = await Promise.all(
        data.map((d) =>
          getDB().collection('comment').count({ contentId: d.id })
        )
      )

      return {
        results: data.map((d, index) => {
          return {
            ...d,
            comments: commentsCount[index],
          }
        }),
        from,
        limit,
      }
    })
}

export function deleteContent(type, options) {
  return getDB()
    .collection(type)
    .remove(options)
}

export function deleteOneContent(type, options) {
  return getDB()
  .collection(type)
  .remove(options, true)
}
