import { getDB } from '@lib/api/db'
import { ANY_OBJECT } from '@lib/types'

export function findOneNotification(options) {
  return getDB()
    .collection('notifications')
    .findOne(options)
}

export function addNotification(data) {
  return getDB()
    .collection('notifications')
    .add(data)
}

export function updateOneNotification(id, data) {
  return getDB()
    .collection('notifications')
    .doc(id)
    .set(data)
}

export async function findNotifications(
  options = {},
  paginationOptions: ANY_OBJECT = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('notifications')
    .count(options)

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
        total,
      }
    })
}

export function deleteNotifications(options) {
  return getDB()
    .collection('notifications')
    .remove(options)
}

export function deleteOneNotification(options) {
  return getDB()
    .collection('notifications')
    .remove(options, true)
}
