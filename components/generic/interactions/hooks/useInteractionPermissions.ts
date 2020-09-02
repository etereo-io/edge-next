import { usePermission } from '@lib/client/hooks'
import { getInteractionsDefinition } from '@lib/config'

import { Action, useInteractionPermissionsResult } from '../types'

function getPermissions(
  entity: string,
  slug: string,
  interactionType: string,
  action: Action
): string[] {
  return [
    `${entity}.${slug}.interactions.${interactionType}.${action}`,
    `${entity}.${slug}.interactions.${interactionType}.admin`,
  ]
}

const actions: Action[] = ['read', 'create', 'delete', 'admin']

export default function useInteractionPermissions(
  entity,
  slug
): useInteractionPermissionsResult {
  const permissions = {}
  const interactions = getInteractionsDefinition(entity, slug).map(
    ({ type }) => type
  )

  interactions.forEach((type) => {
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
