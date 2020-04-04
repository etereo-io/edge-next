import config from '../config'

export function hasPermission(user, permission) {
  const roles = user ? user.roles : ['public']
  console.log('Checking permission', permission, roles)
  console.log(config.permissions)
  // Return false if it's not on the list
  if (!config.permissions[permission]) {
    console.log('Not found permission')
    return false
  }

  const authorizedRoles = config.permissions[permission]

  // Return true if the current role for the user is on the config, or if it's public
  for (var i = 0; i < roles.length; i++) {
    if (authorizedRoles.find((r) => r === roles[i] || r === 'public')) {
      console.log('Permission found')
      return true
    }
  }
  console.log('Not found permission')
  return false
}
