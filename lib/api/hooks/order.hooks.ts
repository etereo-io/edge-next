import { ACTIVITY_TYPES } from '@lib/constants'
import { OrderType } from '@lib/types/entities/orders'
import { UserType } from '@lib/types/entities/user'
import {
  addActivity,
} from '@lib/api/entities/activity'
import config from '@lib/config'

export  async function onOrderCreated(order: OrderType, user : UserType) {
  if (config.activity.enabled && user) {
    await addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.ORDER_CREATED,
      meta: {
        orderId: order.id
      },
    })
  }
}
