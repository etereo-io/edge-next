import getPermissions from './get-permissions'

// Given a user object and a list of pe
export default function hasPermission(user, permission, customPermissions) {
  const roles =
    user && user.roles && user.roles.length > 0 ? user.roles : ['PUBLIC']

  const permissions = customPermissions || getPermissions()

  const permissionsToCheck =
    typeof permission === 'string' ? [permission] : permission

  const canAcccess = permissionsToCheck.reduce((prev, p) => {
    const authorizedRoles = permissions[p]

    if (!authorizedRoles) {
      return prev || false
    }

    // Return true if the current role for the user is on the config, or if it's public
    for (var i = 0; i < roles.length; i++) {
      if (authorizedRoles.find((r) => r === roles[i] || r === 'PUBLIC')) {
        return true
      }
    }

    return prev
  }, false)

  return canAcccess
}
