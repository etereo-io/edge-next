import hasPerm from './has-permission'

// Check permissions for a content type/ group type or a content item / group item.
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
const standardEntityPermission = entity => (user, entityType, action, item) => {
  const permission = [
    `${entity}.${entityType}.${action}`,
    `${entity}.${entityType}.admin`,
  ]


  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if (item) {
    const isOwner = user && item.author === user.id
    const isAdmin = user && user.roles && user.roles.indexOf('ADMIN') !== -1

    canAccess = hasPerm(user, permission) || isOwner

    // Draft check
    if (item.draft && !isOwner && !isAdmin) {
      canAccess = false
    }
  } else {
    canAccess = hasPerm(user, permission)
  }

  return canAccess
}


export const hasPermission = hasPerm
export const contentPermission = standardEntityPermission('content')
export const groupPermission = standardEntityPermission('group')

// Check permissions for users or a user item
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export const userPermission = function (user, action, userId) {
  const permission = [`user.${action}`, `user.admin`]
  const canAccess = hasPerm(user, permission)

  if (userId) {
    
    const isUsername = userId.indexOf('@') === 0 ? true : false
    // Check, if there is an userId, if the current user correspond with the userId (username or id or me)
    const isOwner =
      (userId &&
        user &&
        (isUsername
          ? user.username === userId.replace('@', '')
          : user.id === userId)) ||
      (user && userId === 'me')
    
    return canAccess || isOwner
  } else {
    return canAccess
  }

}

// Check permissions for comments or a comment item
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export const commentPermission = function (user, contentType, action, item) {
  const permission = [
    `content.${contentType}.comments.${action}`,
    `content.${contentType}.comments.admin`,
  ]

  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if (item) {
    const isOwner = user && item.author === user.id
    canAccess = hasPerm(user, permission) || isOwner
  } else {
    canAccess = hasPerm(user, permission)
  }

  return canAccess
}
