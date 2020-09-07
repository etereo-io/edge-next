import { getInteractionTypeDefinition } from '@lib/config'
import { INTERACTION_TYPES } from '@lib/constants'

export default (
  entity: 'user' | 'group' | 'content',
  entitySlug: string,
  interactionType: INTERACTION_TYPES
) => (req, res, cb) => {
  const interactionDefinition = getInteractionTypeDefinition(
    entity,
    entitySlug,
    interactionType
  )

  if (!interactionDefinition) {
    cb(new Error('Invalid interaction type'))
  } else {
    req.interactionDefinition = interactionDefinition
    cb()
  }
}
