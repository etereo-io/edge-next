import { FieldType } from './fields'
import { PermissionsType } from './permissions'
import { PublishingType } from './publishing'
import { InteractionTypeDefinition } from './interactionTypeDefinition'

export declare type CommentsType = {
  enabled: boolean;
  permissions: PermissionsType
}

export declare type ContentTypeDefinition = {
  title: string;
  slug: string;
  slugGeneration: string[];
  permissions: PermissionsType;
  publishing: PublishingType;
  monetization?: {
    web: boolean;
  },
  comments: CommentsType;
  fields: FieldType[]
  entityInteractions: InteractionTypeDefinition[]
}