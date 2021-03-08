import { InteractionEntity } from './interaction'
import { PermissionsType } from '../permissions'
import { SEOPropertiesType } from '../seo'

export type MemberType = {
  id: string
  roles: string[]
  email: string[]
  username: string[]
}

export declare type GroupEntityType = {
  id: string
  seo: SEOPropertiesType,
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
