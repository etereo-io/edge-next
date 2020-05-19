import hasPermission from './has-permission'

// Check permissions for a content type or a content item.
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export default function (user, contentType, action, item) {
  const permission = [
    `content.${contentType}.${action}`,
    `content.${contentType}.admin`,
  ]

  // If there is a item we need to check also if the content owner is the current user
  let canAccess = false

  if (item) {
    const isOwner = user && item.author === user.id
    const isAdmin = user && user.roles && user.roles.indexOf('ADMIN') !== -1

    canAccess = hasPermission(user, permission) || isOwner

    // Draft check
    if (item.draft && !isOwner && !isAdmin) {
      canAccess = false
    }
  } else {
    canAccess = hasPermission(user, permission)
  }

  return canAccess
}
