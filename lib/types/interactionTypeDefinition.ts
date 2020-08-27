import { PermissionsType } from './permissions'
import { INTERACTION_TYPES } from '@lib/constants'

export type InteractionTypeDefinition = {
  type: INTERACTION_TYPES
  aggregation?: string
  permissions: PermissionsType
}
