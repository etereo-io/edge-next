import { getDB } from '../../db'

export function findOneNotification(options) {
  return getDB()
    .collection('notifications')
    .findOne(options)
}

export function addNotification(data) {
  return getDB().collection('notifications').add(data)
}

export function updateOneNotification(id, data) {
  return getDB().collection('notifications').doc(id).set(data)
}

export async function findNotifications(
  options = {},
  paginationOptions = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
  return getDB()
    .collection('notifications')
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder,
    })
    .then(async (data) => {
     
      return {
        results: data,
        from,
        limit,
      }
    })
}

export function deleteNotifications(options) {
  return getDB().collection('notifications').remove(options)
}

export function deleteOneNotification(options) {
  return getDB().collection('notifications').remove(options, true)
}
