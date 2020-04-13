import getPermissions from './get-permissions'

export function hasPermission(user, permission) {
  const roles = user ? user.roles : ['public']
  console.log('Checking permission', permission, roles)
  // console.log(permissions)
  const permissions = getPermissions()

  const permissionsToCheck = typeof permission === 'Array' ? permission : [permission]
  // Return false if it's not on the list
  permissionsToCheck.forEach(p => {
    if (!permissions[p]) {
      console.log('Permission does not exist')
      return false
    }
  })

  const canAcccess = permissionsToCheck.reduce((prev, permission) => {
    const canAcccess = false
    const authorizedRoles = permissions[permission]

    // Return true if the current role for the user is on the config, or if it's public
    for (var i = 0; i < roles.length; i++) {
      if (authorizedRoles.find((r) => r === roles[i] || r === 'public')) {
        console.log('Permission available')
        return true
      }
    }

    return prev || canAcccess
  }, false)

  return canAcccess

}
