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
  content: {
    types: [],
    initialContent: [],
  },
  groups: {
    types: [],
    initialGroups: []
  },
  storage: {
    type: null,
  },
  database: {
    type: DATABASES.IN_MEMORY,
  },
  logger: {
    level: 'ERROR'
  },
  activity: {
    enabled: true,
    permissions: {
      read: [ROLES.PUBLIC],
      create: [ROLES.ADMIN],
      update: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
      admin: [ROLES.ADMIN],
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
      // Maybe we dont need this
      'admin.access': newConfig.admin.permissions.access,
      'admin.stats': newConfig.admin.permissions.stats,

      // User permissions
      'user.read': newConfig.user.permissions.read,
      'user.create': newConfig.user.permissions.create,
      'user.update': newConfig.user.permissions.update,
      'user.delete': newConfig.user.permissions.delete,
      'user.admin': newConfig.user.permissions.admin,

      // Activity permissions
      'activity.read': newConfig.activity.permissions.read,
      'activity.create': newConfig.activity.permissions.create,
      'activity.update': newConfig.activity.permissions.update,
      'activity.delete': newConfig.activity.permissions.delete,
      'activity.admin': newConfig.activity.permissions.admin,
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

    // Group permissions
    newConfig.groups.types.forEach((type) => {
      // Who can see the groups of this kind
      availablePermissions[`group.${type.slug}.read`] = type.permissions.read
      // Who can add groups of this kind
      availablePermissions[`group.${type.slug}.create`] = type.permissions.create
      // Who can edit groups of this kind
      availablePermissions[`group.${type.slug}.update`] = type.permissions.update
       // Who can delete groups of this kind
      availablePermissions[`group.${type.slug}.delete`] = type.permissions.delete
      // Who can admin groups of this kind
      availablePermissions[`group.${type.slug}.admin`] = type.permissions.admin
      
      // Who can see the group users
      availablePermissions[`group.${type.slug}.user.read`] = type.user.permissions.read

      // Who can join the gorup on their own
      availablePermissions[`group.${type.slug}.user.join`] = type.user.permissions.join
      
      // Who can add or remove group users (or invite members)
      availablePermissions[`group.${type.slug}.user.update`] = type.user.permissions.update
      
      // Who can administer users (including changing roles)
      availablePermissions[`group.${type.slug}.user.admin`] = type.user.permissions.admin


      // Permissions for content types inside the group
      ;(type.contentTypes || []).forEach(contentType => {
        availablePermissions[`group.${type.slug}.content.${contentType.slug}.read`]  = contentType.permissions.read
        availablePermissions[`group.${type.slug}.content.${contentType.slug}.create`]  = contentType.permissions.create
        availablePermissions[`group.${type.slug}.content.${contentType.slug}.update`]  = contentType.permissions.update
        availablePermissions[`group.${type.slug}.content.${contentType.slug}.delete`]  = contentType.permissions.delete
        availablePermissions[`group.${type.slug}.content.${contentType.slug}.admin`]  = contentType.permissions.admin
      })

    })

    // Store permissions
    newConfig.permissions = availablePermissions

    return newConfig
  } catch (e) {
    console.error(e)
    if (e.name === 'ValidationError') {
      throw new Error('Invalid configuration file: ' + e.errors.join(', '))
    } else {
      throw e
    }
  }
}
