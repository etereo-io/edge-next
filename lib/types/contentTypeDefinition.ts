import { FieldType } from './fields'
import { InteractionTypeDefinition } from './interactionTypeDefinition'
import { PermissionsType } from './permissions'
import { PublishingType } from './publishing'

export declare type CommentsType = {
  enabled: boolean;
  permissions: PermissionsType
}

type PurchasingPermissionsType = {
  buy: [string],
  sell: [string],
  admin: [string],
  orders: [string]
}

export declare type PurchasingType = {
  enabled: boolean;
  permissions: PurchasingPermissionsType
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
  purchasing: PurchasingType;
  fields: FieldType[]
  entityInteractions: InteractionTypeDefinition[]
}