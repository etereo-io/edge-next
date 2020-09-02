import { FieldType } from './fields'
import { PermissionsType } from './permissions'
import { PublishingType } from './publishing'

type RoleType = {
  label: string
  value: string
}

type ContentTypes = {
  slug: string
  permissions: PermissionsType
}

export declare type GroupTypeDefinition = {
  title: string
  slug: string
  slugGeneration: string[]
  permissions: PermissionsType
  publishing: PublishingType
  fields: FieldType[]
  roles: RoleType[]
  user: {
    requireApproval: boolean
    permissions: PermissionsType
  }

  contentTypes: ContentTypes[]
}
