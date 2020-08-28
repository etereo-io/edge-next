import { INTERACTION_TYPES } from '@lib/constants'
import { usePermission } from '@lib/client/hooks'

import { Action, useInteractionPermissionsResult } from '../types'

function getPermissions(
  entity: string,
  slug: string,
  interactionType: INTERACTION_TYPES,
  action: Action
): string[] {
  return [
    `${entity}.${slug}.interactions.${interactionType}.${action}`,
    `${entity}.${slug}.interactions.${interactionType}.admin`,
  ]
}

const actions: Action[] = ['read', 'create', 'delete']

export default function useInteractionPermissions(
  entity,
  slug
): useInteractionPermissionsResult {
  const permissions = {}

  Object.values(INTERACTION_TYPES).forEach((type) => {
    actions.forEach((action) => {
      if (!permissions[type]) {
        permissions[type] = {}
      }
      permissions[type][action] = usePermission(
        getPermissions(entity, slug, type, action)
      ).available
    })
  })

  return permissions
}
