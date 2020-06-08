import hasPerm from './has-permission'

export const hasPermission = hasPerm

// Check permissions for a content type/ group type or a content item / group item.
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export const contentPermission = (user = { roles: ['PUBLIC'] }, entityType, action, item) => {
  const permission = [
    `content.${entityType}.${action}`,
    `content.${entityType}.admin`,
  ]

  // If there is a item we need to check also if the content owner is the current user
  const canAccess = hasPerm(user, permission)

  if (item) {
    const isOwner = user && item.author === user.id
    const isAdmin = hasPerm(user, `content.${entityType}.admin`)
    
    // Draft check
    if (item.draft && !isOwner && !isAdmin) {
      return false
    }

    return canAccess || isOwner
  }

  return canAccess
}

export const groupPermission = (user = { roles: ['PUBLIC'] }, entityType, action, group) => {
  const permission = [
    `group.${entityType}.${action}`,
    `group.${entityType}.admin`,
  ]

  const groupMember = group ? group.members.find(i => i.id === user.id) : null

  // If there is a group we need to check also if the content owner is the current user
  const canAccess = hasPerm(user, permission) || hasPerm(groupMember, permission)
 
  if (group) {
    const isOwner = user && group.author === user.id
    const isAdmin = hasPerm(user, `group.${entityType}.admin`) || hasPerm(user, `group.${entityType}.admin`)
    
    // Draft check
    if (group.draft && !isOwner && !isAdmin) {
      return false
    }

    return canAccess || isOwner
  }

  return canAccess
}

export const groupUserPermission = (user = { roles: ['PUBLIC'] }, entityType, action, group) => {
  const permission = [
    `group.${entityType}.user.${action}`,
    `group.${entityType}.user.admin`,
    `group.${entityType}.admin`
    `user.admin`
  ]

  const groupMember = group ? group.members.find(i => i.id === user.id) : null

  if (group.permissions) {
    // Group based permissions
    return  hasPerm(user, permission, group.permissions) || hasPerm(groupMember, permission, group.permissions)
  }

  // If there is a group we need to check also if the content owner is the current user
  return hasPerm(user, permission) || hasPerm(groupMember, permission)
}

export const groupContentPermission = (user = { roles: ['PUBLIC'] }, entityType, contentType, action, group) => {
  const permission = [
    `group.${entityType}.content.${contentType}.${action}`,
    `group.${entityType}.content.${contentType}.admin`,
    `group.${entityType}.admin`
  ]
  
  const groupMember = group.members ? group.members.find(i => i.id === user.id): null

  if (group.permissions) {
    // Group based permissions
    return  hasPerm(user, permission, group.permissions) || hasPerm(groupMember, permission, group.permissions)
  }

  // If there is a group we need to check also if the content owner is the current user
  return hasPerm(user, permission) || hasPerm(groupMember, permission)
}

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
  const canAccess = hasPerm(user, permission)

  if (item) {
    const isOwner = user && item.author === user.id
    return canAccess || isOwner
  }

  return canAccess
}
