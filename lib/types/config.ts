import { ContentTypeDefinition } from './contentTypeDefinition'
import { UserTypeDefinition } from './userTypeDefinition'
import { GroupTypeDefinition } from './groupTypeDefinition'
import { PermissionsType } from './permissions'

export declare type ThemeType = {
  label: string
  value: string
  mainColor: string
  borderColor: string
}

export declare type ConfigType = {
  title: string
  description: string
  slogan?: string
  url: string
  api: {
    bodyParser: {
      sizeLimit: string
    }
  }
  logger: {
    level: string
  }
  storage: {
    type: string
  }
  database: {
    type: string
  }
  emails: {
    from: string
    contact: string
  }
  theme: {
    default: string
    themes: ThemeType[]
  }
  activity: {
    enabled: boolean
    permissions: PermissionsType[]
    initialActivity: any[] // TODO: Add type
  }
  like: {
    enabled: boolean
  }
  follow: {
    enabled: boolean
  }
  user: UserTypeDefinition

  content: {
    types: ContentTypeDefinition[]
    initialContent: any[] // TODO: Add type
  }

  groups: {
    types: GroupTypeDefinition[]
    initialGroups: any[]
  }
  permissions: object
  superSearch: {
    enabled: boolean
    permissions: string[]
    entities: Array<{
      name: string
      fields: string[]
      permissions: string[]
      type: string
      fieldsForShow: string[]
    }>
  }
  statistic: {
    users: {
      enabled: boolean
      title: string
    }
    content: Array<{ name: string; title: string }>
    groups: Array<{ name: string; title: string }>
  }
}
