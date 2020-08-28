import { INTERACTION_TYPES } from '@lib/constants'
import { InteractionType, InteractionEntity } from '@lib/types'

export { InteractionEntity }

export type InteractionItem = {
  type: INTERACTION_TYPES
  canCreate: boolean
  canRemove: boolean
  interaction: null | InteractionType
}

export type Action = 'read' | 'create' | 'delete'

export type useInteractionPermissionsResult =
  | {
      [name in INTERACTION_TYPES]: {
        [key in Action]: boolean
      }
    }
  | {}
