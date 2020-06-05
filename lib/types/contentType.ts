import { FieldType } from './fields'
import { PermissionsType } from './permissions'

export declare type PublishingType = {
  draftMode: boolean;
  title: string;
}

export declare type CommentsType = {
  enabled: boolean;
  permissions: PermissionsType
}

export declare type ContentType = {
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
}