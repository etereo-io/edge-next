import { DATABASES, ROLES } from './config-constants'

import { getConfig } from '../../edge.config'
import merge from 'deepmerge'
import schema from './config.schema'

const defaultConfig = {
  title: '', // Empty to throw error if not configured
  description: '', // Empty to throw error if not configured
  slogan: 'Hello world', // Home slogan
  url: 'helloworld.com', // Used for e-mails and links

  emails: {
    from: 'hello@world.com',
    contact: 'hello@world.com',
  },

  language: {
    default: 'en',
    available: ['en', 'es', 'de'],
  },

  theme: {
    default: 'light-theme',
    themes: [],
  },

  roles: {
    admin: {
      label: 'Admin',
      value: ROLES.ADMIN,
    },
    user: {
      label: 'User',
      value: ROLES.USER,
    },
    public: {
      label: 'Public',
      value: ROLES.PUBLIC,
    },
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
    roles: [ROLES.USER],
    emailVerification: true,
    providers: {
      facebook: false,
      google: false,
      github: false,
      twitch: false,
      snapchat: false,
      twitter: false,
      linkedin: false,
      foursquare: false,
      tumbler: false,
      steam: false,
      pinterest: false,
      quickbooks: false,
    },
    permissions: {
      read: [ROLES.PUBLIC],
      create: [ROLES.PUBLIC],
      update: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
      admin: [ROLES.ADMIN],
    },
    initialUsers: [],
    profile: {
      fields: [],
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
    initialContent: [],
  },
  groups: {
    types: [],
    initialGroups: []
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
        edited: [ROLES.ADMIN],
      },
      comments: {
        created: [ROLES.PUBLIC],
        deleted: [ROLES.ADMIN],
        edited: [ROLES.ADMIN],
      },
      users: {
        created: [ROLES.ADMIN],
        deleted: [ROLES.ADMIN],
        edited: [ROLES.ADMIN],
      },
    },
    initialActivity: [],
  },
  like: {
    enabled: false,
  },
  report: {
    enabled: false,
  },
  readingList: {
    enabled: false,
  },
  follow: {
    enabled: false,
  },
  search: {
    enabled: false,
  },
}

export default function load() {
  try {
    const mergedConfig = merge(defaultConfig, getConfig(defaultConfig))

    const newConfig = schema.validateSync(mergedConfig, {
      abortEarly: false,
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
      'user.create': newConfig.user.permissions.create,
      'user.update': newConfig.user.permissions.update,
      'user.delete': newConfig.user.permissions.delete,
      'user.admin': newConfig.user.permissions.admin,
      'user.list': newConfig.user.permissions.list,

      // Activity permissions
      'activity.content.created':
        newConfig.activity.permissions.content.created,
      'activity.content.deleted':
        newConfig.activity.permissions.content.deleted,
      'activity.content.edited': newConfig.activity.permissions.content.edited,

      'activity.comments.created':
        newConfig.activity.permissions.comments.created,
      'activity.comments.deleted':
        newConfig.activity.permissions.comments.deleted,
      'activity.comments.edited':
        newConfig.activity.permissions.comments.edited,

      'activity.users.created': newConfig.activity.permissions.users.created,
      'activity.users.deleted': newConfig.activity.permissions.users.deleted,
      'activity.users.edited': newConfig.activity.permissions.users.edited,
    }

    // Content permissions
    newConfig.content.types.forEach((type) => {
      availablePermissions[`content.${type.slug}.read`] = type.permissions.read
      availablePermissions[`content.${type.slug}.create`] =
        type.permissions.create
      availablePermissions[`content.${type.slug}.update`] =
        type.permissions.update
      availablePermissions[`content.${type.slug}.delete`] =
        type.permissions.delete
      availablePermissions[`content.${type.slug}.admin`] =
        type.permissions.admin

      // Comments
      if (type.comments.enabled) {
        availablePermissions[`content.${type.slug}.comments.read`] =
          type.comments.permissions.read
        availablePermissions[`content.${type.slug}.comments.create`] =
          type.comments.permissions.create
        availablePermissions[`content.${type.slug}.comments.update`] =
          type.comments.permissions.update
        availablePermissions[`content.${type.slug}.comments.delete`] =
          type.comments.permissions.delete
        availablePermissions[`content.${type.slug}.comments.admin`] =
          type.comments.permissions.admin
      }
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
