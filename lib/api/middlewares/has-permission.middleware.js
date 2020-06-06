import { contentPermission, groupContentPermission, groupPermission, groupUserPermission, userPermission } from '../../permissions'

import { getAction } from '../api-helpers/methods'

export const hasPermissionsForContent = (contentType, item) => async (req, res, cb) => {
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

export const hasPermissionsForUser = (userId = '') => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = userPermission(req.currentUser, action, userId) 

  if (!canAccess) {
    cb(new Error('User not authorized to perform operation on user ' + userId))
  } else {
    cb()
  }
}


export const hasPermissionsForGroup = (groupType, item) => async (req, res, cb) => {
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



export const hasPermissionsForGroupUser = (groupType, item) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupUserPermission(
    req.currentUser,
    groupType,
    action,
    item
  )

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on group user ' + groupType
      )
    )
  } else {
    cb()
  }
}


export const hasPermissionsForGroupContent = (groupType, contentType, item) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupContentPermission(
    req.currentUser,
    groupType,
    contentType,
    action,
    item
  )

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on group user ' + groupType
      )
    )
  } else {
    cb()
  }
}