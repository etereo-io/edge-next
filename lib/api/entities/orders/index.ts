import { ANY_OBJECT, OrderType } from '@lib/types'

import { getDB } from '@lib/api/db'

type OrdersResponseType = {
  total: number,
  from: number,
  limit: number,
  results: OrderType[]
}

export function findOneOrder(options) {
  return getDB()
    .collection('orders')
    .findOne(options)
}

export function addOrder(data: OrderType) {
  return getDB()
    .collection('orders')
    .add(data)
}

export function updateOneOrder(id, data:OrderType) {
  return getDB()
    .collection('orders')
    .doc(id)
    .set(data)
}

export async function findorders(
  options = {},
  paginationOptions: ANY_OBJECT = {}
): Promise<OrdersResponseType> {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('orders')
    .count(options)

  return getDB()
    .collection('orders')
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

export function deleteorders(options) {
  return getDB()
    .collection('orders')
    .remove(options)
}

export function deleteOneOrder(options) {
  return getDB()
    .collection('orders')
    .remove(options, true)
}
