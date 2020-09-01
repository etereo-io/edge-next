import { INTERACTION_TYPES } from '@lib/constants'
import { UserType } from '@lib/types'

export type InteractionType = {
  id: string
  // property is only present in raw DB data
  _id?: string
  type: INTERACTION_TYPES
  entity: string
  entityType: string
  entityId: string
  author?: string
  createdAt?: number
}

export type InteractionEntity = {
  [name in INTERACTION_TYPES]: {
    result: number | UserType[]
    interaction: null | InteractionType
  }
}