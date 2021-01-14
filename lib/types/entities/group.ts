import { InteractionEntity } from './interaction'
import { PermissionsType } from '../permissions'

export type MemberType = {
  id: string
  roles: string[]
  email: string[]
  username: string[]
}

export declare type GroupEntityType = {
  id: string
  slug: string
  type: string
  title: string
  description: string
  members: MemberType[]
  pendingMembers: MemberType[]
  draft: boolean
  author: string
  createdAt: string
  interactions: InteractionEntity[],
  permissions?: PermissionsType
}
