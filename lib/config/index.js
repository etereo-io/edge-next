import load from './load-config'

const config = load()


const availablePermissions = {
  'admin.access': config.admin.permissions.access,
  'users.read': config.users.permissions.read,
  'users.write': config.users.permissions.write,
  'users.changeRole': config.users.permissions.changeRole,
}

config.content.types.forEach(type => {
  availablePermissions[`content.${type.slug}.read`] = type.permissions.read
  availablePermissions[`content.${type.slug}.write`] = type.permissions.write
  availablePermissions[`content.${type.slug}.delete`] = type.permissions.delete
  availablePermissions[`content.${type.slug}.crossWrite`] = type.permissions.crossWrite
  availablePermissions[`content.${type.slug}.crossDelete`] = type.permissions.crossDelete
})

// Store permissions
config.permissions = availablePermissions

export default config

export const getContentType = (slug) => {
  return config.contentTypes.find(item => item.slug === slug)
}

