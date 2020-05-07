import { getAction } from '../api-helpers/methods'
import { getSession } from '../auth/iron'
import { hasPermission } from '../../permissions'

export const forContent = (contentType, item) => async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const permission = [
    `content.${contentType}.${action}`,
    `content.${contentType}.admin`,
  ]

  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if (item) {
    const isOwner = session && item.author === session.id
    const isAdmin =
      session && session.roles && session.roles.indexOf('ADMIN') !== -1

    canAccess = hasPermission(session, permission) || isOwner

    // Draft check
    if (item.draft && !isOwner && !isAdmin) {
      canAccess = false
    }
  } else {
    canAccess = hasPermission(session, permission)
  }

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    req.user = session
    cb()
  }
}

export const forComment = (contentType, item) => async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)

  const permission = [
    `content.${contentType}.comments.${action}`,
    `content.${contentType}.comments.admin`,
  ]

  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if (item) {
    const isOwner = session && item.author === session.id
    canAccess = hasPermission(session, permission) || isOwner
  } else {
    canAccess = hasPermission(session, permission)
  }

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    req.user = session
    cb()
  }
}

export const forUser = (userId) => async (req, res, cb) => {
  const session = await getSession(req)
  const action = getAction(req.method)

  const permission = [`user.${action}`, `user.admin`]

  // If there is a item we need to check also if the content owner is the current user
  const isOwner = session && userId === session.id
  const canAccess =
    hasPermission(session, permission) || isOwner || userId === 'me'

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    cb()
  }
}
