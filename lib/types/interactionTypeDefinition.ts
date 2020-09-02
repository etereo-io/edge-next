import { PermissionsType } from './permissions'

export type InteractionTypeDefinition = {
  type: string
  aggregation?: string
  icon?: string,
  activeTitle?: string,
  inactiveTitle?: string,
  permissions: PermissionsType
}
