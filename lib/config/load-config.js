import {
  DATABASES,
  ROLES,
} from './config-constants'

import config from '../../empieza.config'
import {
  languages,
} from './locale'
import merge from 'deepmerge'
import schema from './config.schema'

const defaultConfig = {
  title: '', // Empty to throw error if not configured
  description: '', // Empty to throw error if not configured
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
      read: [ROLES.PUBLIC],
      write: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
      admin: [ROLES.ADMIN],
    },
    initialUsers: []
  },
  auth: {
    permissions: {
      signup: [ROLES.PUBLIC],
    },
    defaultUserRoles: [ROLES.USER],
  },
  content: {
    types: [],
    initialContent: []
  },
  tags: {
    permissions: {
      read: [ROLES.PUBLIC],
      write: [ROLES.USER, ROLES.ADMIN],
      deleted: [ROLES.ADMIN],
      admin: [ROLES.ADMIN]
    },
    initialTags: []
  },
  storage: {},
  database: {
    type: DATABASES.IN_MEMORY,
  },
  activity: {
    enabled: true,
    permissions: {
      content: {
        created: [ROLES.PUBLIC],
        deleted: [ROLES.ADMIN],
        edited: [ROLES.ADMIN]
      },
      comments: {
        created: [ROLES.PUBLIC],
        deleted: [ROLES.ADMIN],
        edited: [ROLES.ADMIN]
      },
      users: {
        created: [ROLES.ADMIN],
        deleted: [ROLES.ADMIN],
        edited: [ROLES.ADMIN]
      }
    }
  }
}

export default function load() {
  try {
    const newConfig = merge(defaultConfig, config(defaultConfig))

    schema.validateSync(newConfig, {
      abortEarly: false
    })

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
      'user.list': newConfig.user.permissions.list,

      // Activity permissions
      'activity.content.created': newConfig.activity.permissions.content.created,
      'activity.content.deleted': newConfig.activity.permissions.content.deleted,
      'activity.content.edited': newConfig.activity.permissions.content.edited,

      'activity.comments.created': newConfig.activity.permissions.comments.created,
      'activity.comments.deleted': newConfig.activity.permissions.comments.deleted,
      'activity.comments.edited': newConfig.activity.permissions.comments.edited,

      'activity.users.created': newConfig.activity.permissions.users.created,
      'activity.users.deleted': newConfig.activity.permissions.users.deleted,
      'activity.users.edited': newConfig.activity.permissions.users.edited,

      // Tags permissions
      'tags.read': newConfig.tags.permissions.read,
      'tags.write': newConfig.tags.permissions.write,
      'tags.delete': newConfig.tags.permissions.delete,
      'tags.admin': newConfig.tags.permissions.admin,

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

      // Comments
      availablePermissions[`content.${type.slug}.comments.read`] =
        type.comments.permissions.read
      availablePermissions[`content.${type.slug}.comments.write`] =
        type.comments.permissions.write
      availablePermissions[`content.${type.slug}.comments.delete`] =
        type.comments.permissions.delete
      availablePermissions[`content.${type.slug}.comments.admin`] =
        type.comments.permissions.admin
    })

    // Store permissions
    newConfig.permissions = availablePermissions


    return newConfig
  } catch (e) {
    console.log(e)
    if (e.name === 'ValidationError') {
      throw new Error('Invalid configuration file: ' + e.errors.join(', '))
    } else {
      throw e
    }
  }
}