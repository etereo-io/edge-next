import {
  commentPermission,
  contentPermission,
  userPermission,
} from '../../permissions'

import { getAction } from '../api-helpers/methods'
import { getSession } from '../auth/iron'

export const forContent = (contentType, item) => async (req, res, cb) => {
  const session = await getSession(req)
  const action = getAction(req.method)
  const canAccess = contentPermission(session, contentType, action, item)

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on content ' + contentType
      )
    )
  } else {
    req.currentUser = session
    cb()
  }
}

export const forComment = (contentType, item) => async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const canAccess = commentPermission(session, contentType, action, item)

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on comment ' + contentType
      )
    )
  } else {
    req.currentUser = session
    cb()
  }
}

export const forUser = (userId = '') => async (req, res, cb) => {
  const session = await getSession(req)
  const action = getAction(req.method)

  const isUsername = userId.indexOf('@') === 0 ? true : false
  // Check, if there is an userId, if the current session correspond with the userId (username or id or me)
  const isOwner =
    (userId &&
      session &&
      (isUsername
        ? session.username === userId.replace('@', '')
        : session.id === userId)) ||
    (session && userId === 'me')
  const canAccess = userPermission(session, action) || isOwner

  if (!canAccess) {
    cb(new Error('User not authorized to perform operation on user ' + userId))
  } else {
    req.currentUser = session
    cb()
  }
}
