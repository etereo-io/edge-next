import {
  addShoppingCart,
  findShoppingCarts,
} from '@lib/api/entities/shopping-carts'

import { Request } from '@lib/types'
import { ShoppingCartType } from '@lib/types/entities/shopping-cart'
import { connect } from '@lib/api/db'
import { loadUser } from '@lib/api/middlewares'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { purchasingPermission } from '@lib/permissions'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

function validateShoppingCart(item: ShoppingCartType) {
  if (item.products.length === 0 ) {
    return false
  }

  // TODO: validate data structure. Maybe use yup schema
}

async function createShoppingCart(req: Request, res) {

  if (!purchasingPermission(req.currentUser, 'buy')) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  const shoppingCartObject: ShoppingCartType = {
    ...req.body,
  }

  if (!validateShoppingCart(shoppingCartObject)) {
    return res.status(400).json({
      error: 'Malformed order entity'
    })
  }

  try {
    const result = await addShoppingCart(shoppingCartObject)

    return res.status(200).json(result)
  } catch (err) {
    res.status(500).json({
      error: 'Error creating shoppign cart ' + err.message
    })
  }


}

const getShoppingCarts = (req: Request, res) => {
  const {
    query: { userId, sortBy, sortOrder, from, limit, id },
  } = req

  const filterParams = { }

  if (userId) {
    filterParams['userId'] = userId
  }

  if (id) {
    filterParams['id'] = id
  }

  const canAccessWithBuyerId = (userId && req.currentUser.id === userId) || purchasingPermission(req.currentUser, 'admin')
  const canManageShoppingCarts = purchasingPermission(req.currentUser, 'admin')

  const canAccess = canManageShoppingCarts || canAccessWithBuyerId

  if (!canAccess) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }


  return findShoppingCarts(filterParams, paginationParams)
    .then(result => {
      return res.status(200).json(result)
    })
}


export default async (req: Request, res) => {

  try {
    // Connect to database
    await connect()
  } catch (e) {
    logger('ERROR', 'Can not connect to db', e)
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadUser)
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }


  await methods(req, res, {
    get: getShoppingCarts,
    post: createShoppingCart,
  })
}
