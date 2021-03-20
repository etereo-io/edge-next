import { Request, UserType } from '@lib/types'
import {
  addShoppingCart,
  findShoppingCarts,
} from '@lib/api/entities/shopping-carts'

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

  let validProductAmount = true
  let validProductId = true

  item.products.forEach((p) => {
    
    if (!p.amount || p.amount < 1) {
      validProductAmount = false
    }

    if (!p.productId || !p.productContentType) {
      validProductId = false
    }
  })
  return validProductAmount && validProductId
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
    logger('DEBUG', 'Invalid shopping cart shape')
    return res.status(400).json({
      error: 'Malformed shopping cart entity'
    })
  }
  
  let validProductPermissions = true

  shoppingCartObject.products.forEach((p) => {
    if (!purchasingPermission(req.currentUser, 'buy', p.productContentType)) {
      validProductPermissions = false
    }
  })

  if (!validProductPermissions) {
    logger('DEBUG', 'Invalid shopping cart permissions')

    return res.status(401).json({
      error: 'Invalid product types'
    })
  }

  try {
    const result = await addShoppingCart({
      ...shoppingCartObject,
      userId: req.currentUser.id,
    })

    return res.status(200).json(result)
  } catch (err) {
    logger('ERROR', 'Error creating shoppign cart')

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
