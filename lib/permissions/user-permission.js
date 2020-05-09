import hasPermission from './has-permission'

// Check permissions for users or a user item
// It checks if the user has the permissions for the role or if it's the own user
// This function is used by the client app and the permissions middleware for the API
export default function(user, action, userId) {
  
  const permission = [`user.${action}`, `user.admin`]

  // If there is a item we need to check also if the content owner is the current user
  const isOwner = user && userId && userId === user.id
  const canAccess =
    hasPermission(user, permission) || (isOwner || user && userId === 'me')


  return canAccess
}