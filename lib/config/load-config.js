import config from '../../empieza.config'
import { languages } from './locale'
import schema from './config.schema'
import { DATABASES, ROLES } from './config-constants'

const defaultConfig = {
  language: {
    default: 'en',
    available: ['en', 'es', 'de'],
  },
  roles: {
    admin: ROLES.ADMIN,
    user: ROLES.USER,
    public: ROLES.PUBLIC,
  },
  admin: {
    permissions: {
      access: [ROLES.ADMIN],
      users: [ROLES.ADMIN],
      tags: [ROLES.ADMIN],
      content: [ROLES.ADMIN],
      stats: [ROLES.ADMIN],
    },
  },
  user: {
    roles: [ROLES.ADMIN, ROLES.USER],
    permissions: {
      read: [ROLES.ADMIN],
      write: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
      admin: [ROLES.ADMIN],
    },
  },
  auth: {
    permissions: {
      signup: [ROLES.PUBLIC],
    },
    defaultUserRoles: [ROLES.USER],
  },
  content: {
    types: [],
  },
  storage: {},
  database: {
    type: DATABASES.IN_MEMORY,
  },
}

export default function load() {
  try {
    console.log('loading configuration file')
    const newConfig = Object.assign({}, defaultConfig, config(defaultConfig))

    schema.validateSync(newConfig, { abortEarly: false })

    const availablePermissions = {
      'admin.access': newConfig.admin.permissions.access,
      'admin.stats': newConfig.admin.permissions.stats,

      // Maybe we dont need this
      'admin.users': newConfig.admin.permissions.users,
      'admin.tags': newConfig.admin.permissions.tags,
      'admin.content': newConfig.admin.permissions.content,
      
      // User permissions
      'user.read': newConfig.user.permissions.read,
      'user.write': newConfig.user.permissions.write,
      'user.delete': newConfig.user.permissions.delete,
      'user.admin': newConfig.user.permissions.admin,
    }

    // Content permissions
    newConfig.content.types.forEach((type) => {
      availablePermissions[`content.${type.slug}.read`] = type.permissions.read
      availablePermissions[`content.${type.slug}.write`] =
        type.permissions.write
      availablePermissions[`content.${type.slug}.delete`] =
        type.permissions.delete
      availablePermissions[`content.${type.slug}.admin`] =
        type.permissions.admin
    })

    // Store permissions
    newConfig.permissions = availablePermissions

    return newConfig
  } catch (e) {
    console.log(e)
    throw new Error('Invalid configuration file', e)
  }
}
