import hasPerm from './has-permission'

export const hasPermission = hasPerm

// Check permissions for a content type/ group type or a content item / group item.
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export const contentPermission = (user , entityType, action, content) => {
  if (!user) {
    user = { roles: ['PUBLIC'] }
  }

  const permission = [
    `content.${entityType}.${action}`,
    `content.${entityType}.admin`,
  ]

  // If there is a content we need to check also if the content owner is the current user
  const canAccess = hasPerm(user, permission)

  if (content) {
    const isOwner = user && content.author === user.id
    const isAdmin = hasPerm(user, `content.${entityType}.admin`)

    // Draft check
    if (content.draft && !isOwner && !isAdmin) {
      return false
    }

    return canAccess || isOwner
  }

  return canAccess
}



export const groupContentPermission = (user , entityType, contentType, action, group, content) => {
  if (!user) {
    user = { roles: ['PUBLIC'] }
  }
  const permission = [
    `group.${entityType}.content.${contentType}.${action}`,
    `group.${entityType}.content.${contentType}.admin`,
  ]

  const generalAdminPermissions = [
    `group.${entityType}.admin`,
    `content.${entityType}.admin`
  ]

  let canAccess = hasPerm(user, generalAdminPermissions)

  // If it's admin, avoid further checks
  if (canAccess) {
    return canAccess
  }

  const groupMember = group.members ? group.members.find(i => i.id === user.id): null

  if (group.permissions) {
    // Group based permissions

    canAccess = hasPerm(user, permission, group.permissions) || hasPerm(groupMember, permission, group.permissions)
  } else {
    // If there is a group we need to check also if the content owner is the current user
    canAccess = hasPerm(user, permission) || hasPerm(groupMember, permission)
  }

  // Owner should be able to edit or delete content
  if (content) {
    const isOwner = user && content.author === user.id
    return canAccess || isOwner
  }

  return canAccess

}

export const groupPermission = (user , entityType, action, group) => {
  if (!user) {
    user = { roles: ['PUBLIC'] }
  }
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


export const groupUserPermission = (user , entityType, action, group) => {
  if (!user) {
    user = { roles: ['PUBLIC'] }
  }
  const permission = [
    `group.${entityType}.user.${action}`,
    `group.${entityType}.user.admin`,
  ]

  const generalAdminPermissions = [
    `group.${entityType}.admin`,
    `user.admin`
  ]

  const canAccess = hasPerm(user, generalAdminPermissions)

  // If it's admin, avoid further checks
  if (canAccess) {
    return canAccess
  }

  const groupMember = group ? (group.members || []).find(i => i.id === user.id) : null

  if (group.permissions) {
    // Group based permissions
    return hasPerm(user, permission, group.permissions) || hasPerm(groupMember, permission, group.permissions)
  }

  // If there is a group we need to check also if the content owner is the current user
  return hasPerm(user, permission) || hasPerm(groupMember, permission)
}

// Check permissions for comments or a comment item
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export const commentPermission = function (user, contentType, action, comment) {
  const permission = [
    `content.${contentType}.comments.${action}`,
    `content.${contentType}.comments.admin`,
  ]

  // If there is a content we need to check also if the content owner is the current user
  const canAccess = hasPerm(user, permission)

  if (comment) {
    const isOwner = user && comment.author === user.id
    return canAccess || isOwner
  }

  return canAccess
}

export const groupCommentPermission = (user , entityType, contentType, action, group, comment) => {
  if (!user) {
    user = { roles: ['PUBLIC'] }
  }
  const permission = [
    `group.${entityType}.content.${contentType}.comments.${action}`,
    `group.${entityType}.content.${contentType}.comments.admin`,
    `group.${entityType}.content.${contentType}.admin`,
  ]

  const generalAdminPermissions = [
    `group.${entityType}.admin`,
    `content.${contentType}.comments.admin`,
  ]

  let canAccess = hasPerm(user, generalAdminPermissions)

  // If it's admin, avoid further checks
  if (canAccess) {
    return canAccess
  }

  const groupMember = group.members ? group.members.find(i => i.id === user.id): null

  if (group.permissions) {
    // Group based permissions
    canAccess = hasPerm(user, permission, group.permissions) || hasPerm(groupMember, permission, group.permissions)
  } else {
    // If there is a group we need to check also if the content owner is the current user
    canAccess = hasPerm(user, permission) || hasPerm(groupMember, permission)
  }

  // Comment owner has the rights to delete or edit a comment
  if (comment) {
    const isOwner = user && comment.author === user.id
    return canAccess || isOwner
  }

  return canAccess
}

