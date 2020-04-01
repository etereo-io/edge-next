import config from '../../empieza.config'
import { languages } from './locale'
import schema from './config.schema'

const ROLE_ADMIN = 'admin'
const ROLE_USER = 'user'
const ROLE_PUBLIC = 'public'

const defaultConfig = {
  language: {
    default: 'en',
    available: ['en', 'es', 'de']
  },
  roles: {
    admin: ROLE_ADMIN,
    user: ROLE_USER,
    public: ROLE_PUBLIC
  },
  admin: {
    permissions: {
      access: [ROLE_ADMIN],
      users: [ROLE_ADMIN],
      tags: [ROLE_ADMIN],
      content: [ROLE_ADMIN],
      stats: [ROLE_ADMIN]
    }
  },
  user: {
    roles: [ROLE_ADMIN, ROLE_USER],
    permissions: {
      read: [ROLE_ADMIN],
      write: [ROLE_ADMIN],
      delete: [ROLE_ADMIN],
    }
  },
  auth: {
    permissions: {
      signup: [ROLE_PUBLIC],
    },
    defaultUserRoles: [USER_ROLE.id]
  },
  content: {
    types: []
  },
  storage: {},
  database: {
    type: DATABASE_TYPES.IN_MEMORY
  }
}

export default function load() {
    
  try {
    console.log('loading configuration file')
    const newConfig = config(defaultConfig)
    
    schema.validateSync(newConfig, { abortEarly: false })

    return newConfig  
  } catch (e)  {
    console.log(e)
    throw new Error('Invalid configuration file', e)
  }

}