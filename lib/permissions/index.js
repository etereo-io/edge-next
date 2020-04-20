import getPermissions from './get-permissions'

// Given a user object and a list of pe
export function hasPermission(user, permission) {
  const roles = user ? user.roles : ['public']
  
  // console.log('Checking permission', permission, roles)
  
  const permissions = getPermissions()

  const permissionsToCheck = typeof permission === 'string' ? [permission] : permission
  

  const canAcccess = permissionsToCheck.reduce((prev, p) => {
    
    const authorizedRoles = permissions[p] 

    if (!authorizedRoles) {
      // console.log('Permission ' + p + ' does not exist')
      return prev || false
    }

    // Return true if the current role for the user is on the config, or if it's public
    for (var i = 0; i < roles.length; i++) {
      if (authorizedRoles.find((r) => r === roles[i] || r === 'public')) {
        return true
      }
    }

    return prev
  }, false)

  return canAcccess

}
