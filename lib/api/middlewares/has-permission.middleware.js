import { getSession } from '../auth/iron'
import { hasPermission } from '../../permissions'

// This needs to be refactored somehow in a clever way

const getAction = (method) => {  
  // TODO: See how to handle actions for updating documents from other users
  switch (method) {
    case 'GET':
      return 'read'
    case 'POST':
    case 'PUT':
      return 'write'
    case 'DELETE':
      return 'delete'
    default:
      return ''
  }
}

export const forContent = (item) => async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const permission = [`content.${req.contentType.slug}.${action}`, `content.${req.contentType.slug}.admin`]

  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if ( item ) {
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


export const forComment = item => async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  
  const permission = [`content.${req.contentType.slug}.comments.${action}`, `content.${req.contentType.slug}.comments.admin`]
  
  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if ( item ) {
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