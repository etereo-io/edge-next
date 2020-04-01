import config from '../../empieza.config'
import { languages } from './locale'
import schema from './config.schema'
import { DATABASES, ROLES } from '../config-constants'


const defaultConfig = {
  language: {
    default: 'en',
    available: ['en', 'es', 'de']
  },
  roles: {
    admin: ROLES.ADMIN,
    user: ROLES.USER,
    public: ROLES.PUBLIC
  },
  admin: {
    permissions: {
      access: [ROLES.ADMIN],
      users: [ROLES.ADMIN],
      tags: [ROLES.ADMIN],
      content: [ROLES.ADMIN],
      stats: [ROLES.ADMIN]
    }
  },
  user: {
    roles: [ROLES.ADMIN, ROLES.USER],
    permissions: {
      read: [ROLES.ADMIN],
      write: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
    }
  },
  auth: {
    permissions: {
      signup: [ROLES.PUBLIC],
    },
    defaultUserRoles: [ROLES.USER]
  },
  content: {
    types: []
  },
  storage: {},
  database: {
    type: DATABASES.IN_MEMORY
  }
}

export default function load() {
    
  try {
    console.log('loading configuration file')
    const newConfig = Object.assign({}, defaultConfig, config(defaultConfig))
    
    schema.validateSync(newConfig, { abortEarly: false })

    return newConfig  
  } catch (e)  {
    console.log(e)
    throw new Error('Invalid configuration file', e)
  }

}