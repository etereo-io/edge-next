import config from '../config'

export function hasPermission(user, permission) {
  const roles =  user ? user.roles : ['public']

  // Return false if it's not on the list
  if(!config.permissions[permission]) {
    return false
  }

  const authorizedRoles = config.permissions[permission]

  for(var i = 0; i < roles.length; i++) {
    if (authorizedRoles.find(r => r === roles[i])) {
      return true
    }
  }

  return false
}