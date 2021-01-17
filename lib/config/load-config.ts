import { DATABASES } from '@lib/constants'
import { getConfig } from '../../edge.config'
import merge from 'deepmerge'
import schema from './config.schema'

const defaultConfig = {
  title: '', // Empty to throw error if not configured
  description: '', // Empty to throw error if not configured
  slogan: 'Hello world', // Home slogan

  emails: {
    from: 'hello@world.com',
    contact: 'hello@world.com',
  },

  theme: {
    default: 'light-theme',
    themes: [],
  },

  admin: {
    permissions: {
      access: [],
      stats: [],
      email: [],
    },
  },

  user: {
    roles: [],
    newUserRoles: [],
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
      read: [],
      create: [],
      update: [],
      delete: [],
      admin: [],
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
    initialGroups: [],
  },
  storage: {
    type: null,
  },
  database: {
    type: DATABASES.IN_MEMORY,
  },
  logger: {
    level: 'ERROR',
  },
  activity: {
    enabled: true,
    permissions: {
      read: [],
      create: [],
      update: [],
      delete: [],
      admin: [],
    },
    initialActivity: [],
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
      'admin.email': newConfig.admin.permissions.email,

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

      // Super search permissions
    }

    if (newConfig.superSearch && newConfig.superSearch.permissions) {
      availablePermissions['superSearch.read'] =
        newConfig.superSearch.permissions.read
    }

    // Purchasing
    if (newConfig.purchasing.enabled) {
      availablePermissions[`purchasing.buy`] =
        newConfig.purchasing.permissions.buy
      availablePermissions[`purchasing.sell`] =
        newConfig.purchasing.permissions.sell
      availablePermissions[`purchasing.orders`] =
        newConfig.purchasing.permissions.orders
      availablePermissions[`purchasing.admin`] =
        newConfig.purchasing.permissions.admin
    }


    // interactions
    ;(newConfig.user.entityInteractions || []).forEach(
      ({ type: interactionType, permissions }) => {
        Object.entries(permissions).forEach(([key, value]) => {
          availablePermissions[
            `user.user.interactions.${interactionType}.${key}`
          ] = value
        })
      }
    )

    if (newConfig?.user?.profile?.fields) {
      newConfig.user.profile.fields.forEach(
        ({ name, cypher: { read } = {} }) => {
          if (read) {
            availablePermissions[`user.profile.fields.${name}.cypher`] = read
          }
        }
      )
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

      // Purchasing
      if (type.purchasing.enabled) {
        availablePermissions[`content.${type.slug}.purchasing.buy`] =
          type.purchasing.permissions.buy
        availablePermissions[`content.${type.slug}.purchasing.sell`] =
          type.purchasing.permissions.sell
        availablePermissions[`content.${type.slug}.purchasing.orders`] =
          type.purchasing.permissions.orders
        availablePermissions[`content.${type.slug}.purchasing.admin`] =
          type.purchasing.permissions.admin
      }

      // interactions
      ;(type.entityInteractions || []).forEach(
        ({ type: interactionType, permissions }) => {
          Object.entries(permissions).forEach(([key, value]) => {
            availablePermissions[
              `content.${type.slug}.interactions.${interactionType}.${key}`
            ] = value
          })
        }
      )

      // fields
      if (type.fields) {
        type.fields.forEach(({ name, cypher: { read } = {} }) => {
          if (read) {
            availablePermissions[
              `content.${type.slug}.fields.${name}.cypher`
            ] = read
          }
        })
      }
    })

    // Group permissions
    newConfig.groups.types.forEach((type) => {
      // Who can see the groups of this kind
      availablePermissions[`group.${type.slug}.read`] = type.permissions.read
      // Who can add groups of this kind
      availablePermissions[`group.${type.slug}.create`] =
        type.permissions.create
      // Who can edit groups of this kind
      availablePermissions[`group.${type.slug}.update`] =
        type.permissions.update
      // Who can delete groups of this kind
      availablePermissions[`group.${type.slug}.delete`] =
        type.permissions.delete
      // Who can admin groups of this kind
      availablePermissions[`group.${type.slug}.admin`] = type.permissions.admin

      // Who can see the group users
      availablePermissions[`group.${type.slug}.user.read`] =
        type.user.permissions.read

      // Who can join the gorup on their own
      availablePermissions[`group.${type.slug}.user.join`] =
        type.user.permissions.join

      // Who can add or remove group users (or invite members)
      availablePermissions[`group.${type.slug}.user.update`] =
        type.user.permissions.update

      // Who can administer users (including changing roles)
      availablePermissions[`group.${type.slug}.user.admin`] =
        type.user.permissions.admin

      // Permissions for content types inside the group
      ;(type.contentTypes || []).forEach((contentType) => {
        availablePermissions[
          `group.${type.slug}.content.${contentType.slug}.read`
        ] = contentType.permissions.read
        availablePermissions[
          `group.${type.slug}.content.${contentType.slug}.create`
        ] = contentType.permissions.create
        availablePermissions[
          `group.${type.slug}.content.${contentType.slug}.update`
        ] = contentType.permissions.update
        availablePermissions[
          `group.${type.slug}.content.${contentType.slug}.delete`
        ] = contentType.permissions.delete
        availablePermissions[
          `group.${type.slug}.content.${contentType.slug}.admin`
        ] = contentType.permissions.admin

        // Comments
        if (contentType.comments && contentType.comments.enabled) {
          availablePermissions[
            `group.${type.slug}.content.${contentType.slug}.comments.read`
          ] = contentType.comments.permissions.read
          availablePermissions[
            `group.${type.slug}.content.${contentType.slug}.comments.create`
          ] = contentType.comments.permissions.create
          availablePermissions[
            `group.${type.slug}.content.${contentType.slug}.comments.update`
          ] = contentType.comments.permissions.update
          availablePermissions[
            `group.${type.slug}.content.${contentType.slug}.comments.delete`
          ] = contentType.comments.permissions.delete
          availablePermissions[
            `group.${type.slug}.content.${contentType.slug}.comments.admin`
          ] = contentType.comments.permissions.admin
        }
      })

      // interactions
      ;(type.entityInteractions || []).forEach(
        ({ type: interactionType, permissions }) => {
          Object.entries(permissions).forEach(([key, value]) => {
            availablePermissions[
              `group.${type.slug}.interactions.${interactionType}.${key}`
            ] = value
          })
        }
      )

      // fields
      if (type.fields) {
        type.fields.forEach(({ name, cypher: { read } = {} }) => {
          if (read) {
            availablePermissions[
              `group.${type.slug}.fields.${name}.cypher`
            ] = read
          }
        })
      }
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
