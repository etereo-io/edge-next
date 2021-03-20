// GET, UPDATE; DELETE CART

import {
  addShoppingCart,
  findOneShoppingCart,
  findShoppingCarts,
  updateOneShoppingCart,
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

  const cart = await findOneShoppingCart({
    userId: req.query.userId
  })

  if (!cart) {
    return res.status(404).json({
      error: 'Not found'
    })
  }

  const canAccess = (purchasingPermission(req.currentUser, 'buy') && cart.userId === req.currentUser.id) || purchasingPermission(req.currentUser, 'admin')

  if (!canAccess) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  await methods(req, res, {
    get: function() {
      res.status(200).json({
        cart
      })
    },
    put: async function() {
      const newCartInfo = req.body

      // TODO: Validate body info
      const result = await updateOneShoppingCart(cart.id, {
        ...newCartInfo
      })

      res.status(200).json({
        cart: result
      })
    },
  })
}
