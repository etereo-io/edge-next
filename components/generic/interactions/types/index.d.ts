import {
  InteractionType,
  InteractionEntity,
  InteractionTypeDefinition,
} from '@lib/types'

export { InteractionEntity }
export { InteractionTypeDefinition }

export type InteractionItem = {
  type: string
  canCreate: boolean
  canRemove: boolean
  interaction: null | InteractionType
  count: null | number
  isNumber: boolean
  config: InteractionTypeDefinition
}

export type Action = 'read' | 'create' | 'delete' | 'admin'

export type useInteractionPermissionsResult =
  | {
      [name: string]: {
        [key in Action]: boolean
      }
    }
  | {}
