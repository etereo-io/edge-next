import { InteractionType } from '@lib/types/entities/interaction'
import { getDB } from '../../db'

export async function createInteraction(
  interaction: InteractionType
): Promise<InteractionType> {
  return getDB()
    .collection('interactions')
    .add(interaction)
}

export async function findInteractions(options, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('interactions')
    .count(options)

  return getDB()
    .collection('interactions')
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

export function findOneInteraction(options): Promise<InteractionType> {
  return getDB()
    .collection('interactions')
    .findOne(options)
}

export function updateOneInteraction(id, data): Promise<InteractionType> {
  return getDB()
    .collection('interactions')
    .doc(id)
    .set(data)
}

export function deleteInteractions(options) {
  return getDB()
    .collection('interactions')
    .remove(options)
}

export function deleteOneInteraction(options) {
  return getDB()
    .collection('interactions')
    .remove(options, true)
}
