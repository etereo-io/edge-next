// Register order create
// Fetch the original product,
// If it does not exist or is not buyable, return 400
// check if the current user can buy
// If it does not have permissions, cancel and 401
// For each product: see if the stock is greater than 0
// Return 400 if some product stock is 0 (?)

// Create the order , mark it as created
// Set the sellerID as the owner of the product
// Return OK

// Fetch orders
// Get all the orders with the sellerID 

// Update order
// Check sellerId and userId or admin permissions

import {
  addOrder,
  findOrders,
} from '@lib/api/entities/orders'

import { OrderType } from '@lib/types/entities/orders'
import { Request } from '@lib/types'
import { connect } from '@lib/api/db'
import { loadUser } from '@lib/api/middlewares'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import {
  onOrderCreated,
} from '@lib/api/hooks/order.hooks'
import { purchasingPermission } from '@lib/permissions'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import validateOrder from '@lib/validations/order'

async function createOrder(req: Request, res) {

  if (!purchasingPermission(req.currentUser, 'buy')) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  const orderObject: OrderType = {
    ...req.body,
  }

  if (!validateOrder(orderObject)) {
    return res.status(400).json({
      error: 'Malformed order entity'
    })
  }

  try {
    const result = await addOrder(orderObject)
    await onOrderCreated(result, req.currentUser)

    return res.status(200).json(result)
  } catch (err) {
    res.status(500).json({
      error: 'Error sending message ' + err.message
    })
  }


}

const getOrders = (req: Request, res) => {
  const {
    query: { sellerId, buyerId, sortBy, sortOrder, from, limit },
  } = req

  const filterParams = { }

  if (sellerId) {
    filterParams['sellerId'] = sellerId
  }

  if (buyerId) {
    filterParams['buyerId'] = buyerId
  }


  // If there is a buyer ID
  // We allow the current user to see their orders
  // We allow order manager role to see orders
  // We allow seller to see orders
  const canAccessWithBuyerId = buyerId && (req.currentUser.id === buyerId || purchasingPermission(req.currentUser, 'orders') || (sellerId && req.currentUser.id === sellerId))
  const canAccessWithoutSellerId = !sellerId && purchasingPermission(req.currentUser, 'orders')
  const canAccessSellerId = sellerId && (req.currentUser.id === sellerId || purchasingPermission(req.currentUser, 'orders'))
  const canManageOrders = purchasingPermission(req.currentUser, 'orders')

  const canAccess = canAccessWithBuyerId || canAccessWithoutSellerId || canAccessSellerId || canManageOrders

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


  return findOrders(filterParams, paginationParams)
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
    get: getOrders,
    post: createOrder,
  })
}
