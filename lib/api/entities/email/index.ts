import { EmailType } from '@lib/types/entities/email'
import { getDB } from '@lib/api/db'

export function deleteEmail(options) {
  return getDB()
    .collection('emails')
    .remove(options)
}

export function addEmail(data : EmailType) {
  return getDB()
    .collection('emails')
    .add({
      ...data,
      createdAt: Date.now(),
    })
}

export async function findEmails(options, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('emails')
    .count(options)

  return getDB()
    .collection('emails')
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder,
    })
    .then((data) => {
      return {
        results: data,
        from,
        limit,
        total,
      }
    })
}
