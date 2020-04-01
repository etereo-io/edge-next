import load from './load-config'

const config = load()

const availablePermissions = {
  'admin.access': config.admin.permissions.access,
  'admin.users': config.admin.permissions.users,
  'admin.users': config.admin.permissions.users,
  'admin.tags': config.admin.permissions.tags,
  'admin.content': config.admin.permissions.content,
  'admin.stats': config.admin.permissions.stats,
  'user.read': config.user.permissions.read,
  'user.write': config.user.permissions.write,
  'user.delete': config.user.permissions.delete,
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

