import { contentPermission, groupContentPermission, groupPermission, groupUserPermission, userPermission } from '../../permissions'

import { getAction } from '../api-helpers/methods'

export const hasPermissionsForContent = (contentType, content) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = contentPermission(
    req.currentUser,
    contentType,
    action,
    content
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


export const hasPermissionsForGroup = (groupType, group) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupPermission(
    req.currentUser,
    groupType,
    action,
    group
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



export const hasPermissionsForGroupUser = (groupType, group, userId = '') => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupUserPermission(
    req.currentUser,
    groupType,
    action,
    group,
    userId
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


export const hasPermissionsForGroupContent = (groupType, contentType, group, content) => async (req, res, cb) => {
  const action = getAction(req.method)

  const canAccess = groupContentPermission(
    req.currentUser,
    groupType,
    contentType,
    action,
    group,
    content
  )

  if (!canAccess) {
    cb(
      new Error(
        'User not authorized to perform operation on group content ' + groupType
      )
    )
  } else {
    cb()
  }
}