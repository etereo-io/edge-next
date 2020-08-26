import { FieldType } from './fields'
import { PermissionsType } from './permissions'
import { PublishingType } from './publishing'

export declare type CommentsType = {
  enabled: boolean;
  permissions: PermissionsType
}

export declare type ContentTypeDefinition = {
  title: string;
  slug: string;
  type: string;
  slugGeneration: string[];
  permissions: PermissionsType;
  publishing: PublishingType;
  monetization?: {
    web: boolean;
  },
  comments: CommentsType;
  fields: FieldType[]
}