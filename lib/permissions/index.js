import config from '../config'

export function hasPermission(user, permission) {
  console.log('Checking permission', permission)
  const roles =  user ? user.roles : ['public']
  console.log(config.permissions)
  // Return false if it's not on the list
  if(!config.permissions[permission]) {
    return false
  }

  const authorizedRoles = config.permissions[permission]

  // Return true if the current role for the user is on the config, or if it's public
  for(var i = 0; i < roles.length; i++) {
    if (authorizedRoles.find(r => r === roles[i] || r === 'public')) {
      return true
    }
  }

  return false
}