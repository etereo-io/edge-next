import hasPermission from './has-permission'

// Check permissions for users or a user item
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export default function (user, action) {
  const permission = [`user.${action}`, `user.admin`]

  const canAccess = hasPermission(user, permission)

  return canAccess
}
