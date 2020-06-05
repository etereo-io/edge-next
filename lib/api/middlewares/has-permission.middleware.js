import { contentPermission, groupPermission, userPermission } from '../../permissions'

import { getAction } from '../api-helpers/methods'

export const forContent = (contentType, item) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = contentPermission(
    req.currentUser,
    contentType,
    action,
    item
  )

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on content ' + contentType
      )
    )
  } else {
    cb()
  }
}

export const forUser = (userId = '') => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = userPermission(req.currentUser, action, userId) 

  if (!canAccess) {
    cb(new Error('User not authorized to perform operation on user ' + userId))
  } else {
    cb()
  }
}


export const forGroup = (groupType, item) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupPermission(
    req.currentUser,
    groupType,
    action,
    item
  )

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on group ' + groupType
      )
    )
  } else {
    cb()
  }
}
