import { UserType } from '@lib/types'

export type InteractionType = {
  id: string
  // property is only present in raw DB data
  _id?: string
  type: string
  entity: string
  entityType: string
  entityId: string
  author?: string
  createdAt?: number
}

export type InteractionEntity = {
  [name: string]: {
    result: number | UserType[]
    interaction: null | InteractionType
  }
}