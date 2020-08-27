import {
  ConfigType,
  ContentTypeDefinition,
  GroupTypeDefinition,
  InteractionTypeDefinition,
} from '@lib/types'

import load from './load-config'

const config: ConfigType = load()

export default config

export const getContentTypeDefinition = (
  slug
): ContentTypeDefinition | undefined => {
  return config.content.types.find((item) => item.slug === slug)
}

export const getPermissions = () => {
  return config.permissions
}

export const getGroupTypeDefinition = (
  slug
): GroupTypeDefinition | undefined => {
  return config.groups.types.find((item) => item.slug === slug)
}

export const getInteractionTypeDefinition = (
  entity: 'group' | 'content' | 'user',
  entitySlug: string,
  type: string
): InteractionTypeDefinition | undefined => {
  if (!type) {
    return
  }

  let entityRecord = null

  switch (entity) {
    case 'content': {
      entityRecord = getContentTypeDefinition(entitySlug)

      break
    }

    case 'group': {
      entityRecord = getGroupTypeDefinition(entitySlug)

      break
    }

    case 'user': {
      entityRecord = config.user

      break
    }

    default:
    // DO NOTHING
  }

  return (
    entityRecord &&
    (entityRecord.entityInteractions || []).find(
      ({ type: interactionType }) => interactionType === type
    )
  )
}
