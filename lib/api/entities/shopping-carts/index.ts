import { ANY_OBJECT, ShoppingCartType } from '@lib/types'

import { getDB } from '@lib/api/db'

type ShoppingCartsResponseType = {
  total: number,
  from: number,
  limit: number,
  results: ShoppingCartType[]
}

export function findOneShoppingCart(options) {
  return getDB()
    .collection('shopping-carts')
    .findOne(options)
}

export function addShoppingCart(data: ShoppingCartType) {
  return getDB()
    .collection('shopping-carts')
    .add(data)
}

export function updateOneShoppingCart(id, data:ShoppingCartType) {
  return getDB()
    .collection('shopping-carts')
    .doc(id)
    .set(data)
}

export async function findShoppingCarts(
  options = {},
  paginationOptions: ANY_OBJECT = {}
): Promise<ShoppingCartsResponseType> {
  const { from = 0, limit = 15, sortBy, sortShoppingCart = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('shopping-carts')
    .count(options)

  return getDB()
    .collection('shopping-carts')
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortShoppingCart,
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

export function deleteShoppingCarts(options) {
  return getDB()
    .collection('shopping-carts')
    .remove(options)
}

export function deleteOneShoppingCart(options) {
  return getDB()
    .collection('shopping-carts')
    .remove(options, true)
}
