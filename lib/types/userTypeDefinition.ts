import { UserType } from '@lib/types/entities/user'

import { FieldOptionType, FieldType } from './fields'
import { PermissionsType } from './permissions'
import { InteractionTypeDefinition } from './interactionTypeDefinition'

export type UserTypeDefinition = {
  roles: FieldOptionType[]
  newUserRoles: string[]
  emailVerification: boolean
  providers: {
    facebook: boolean
    google: boolean
    github: boolean
    instagram: boolean
    snapchat: boolean
    twitter: boolean
    linkedin: boolean
    twitch: boolean
    foursquare: boolean
    tumblr: boolean
    steam: boolean
    pinterest: boolean
    quickbooks: boolean
  }
  profile: {
    fields: FieldType[]
  }
  permissions: PermissionsType[]
  initialUsers: UserType[]
  entityInteractions: InteractionTypeDefinition[]
}
