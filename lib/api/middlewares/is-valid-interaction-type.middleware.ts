import { getInteractionTypeDefinition } from '@lib/config'

export default (
  entity: 'user' | 'group' | 'content',
  entitySlug: string,
  interactionType: string
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
