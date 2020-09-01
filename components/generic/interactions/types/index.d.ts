import { INTERACTION_TYPES } from '@lib/constants'
import { InteractionType, InteractionEntity } from '@lib/types'

export { InteractionEntity }

export type InteractionItem = {
  type: INTERACTION_TYPES
  canCreate: boolean
  canRemove: boolean
  interaction: null | InteractionType
  count: null | number
  isNumber: boolean
}

export type Action = 'read' | 'create' | 'delete'

export type useInteractionPermissionsResult =
  | {
      [name in INTERACTION_TYPES]: {
        [key in Action]: boolean
      }
    }
  | {}
