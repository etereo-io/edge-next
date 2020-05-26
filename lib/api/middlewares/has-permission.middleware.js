import {
  contentPermission,
  userPermission,
} from '../../permissions'

import { getAction } from '../api-helpers/methods'

export const forContent = (contentType, item) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = contentPermission(req.currentUser, contentType, action, item)

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

  const isUsername = userId.indexOf('@') === 0 ? true : false
  // Check, if there is an userId, if the current req.currentUser correspond with the userId (username or id or me)
  const isOwner =
    (userId &&
      req.currentUser &&
      (isUsername
        ? req.currentUser.username === userId.replace('@', '')
        : req.currentUser.id === userId)) ||
    (req.currentUser && userId === 'me')
  const canAccess = userPermission(req.currentUser, action) || isOwner

  if (!canAccess) {
    cb(new Error('User not authorized to perform operation on user ' + userId))
  } else {
    cb()
  }
}
