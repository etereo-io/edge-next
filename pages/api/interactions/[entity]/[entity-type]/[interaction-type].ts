import {
  createInteraction,
  deleteOneInteraction,
  findInteractions,
  findOneInteraction,
} from '@lib/api/entities/interactions'

import { InteractionType } from '@lib/types/entities/interaction'
import { connect } from '@lib/api/db'
import { interactionPermission } from '@lib/permissions'
import { loadUser } from '@lib/api/middlewares'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getInteractions = (paginationParams) => (req, res) => {
  const hasRights = interactionPermission(req.currentUser, req.query.entity, req.query['entity-type'], req.query['interaction-type'], 'read')

  if (!hasRights) {
    return res.status(401).json({
      error: 'Not authorized'
    })
  }
  const filterParams = <{ entity?: string, entityType?: string, type: string, author?: string, entityId?: string}>{
    entity: req.query['entity'],
    entityType: req.query['entity-type'],
    type: req.query['interaction-type']
  }

  if (req.query.author) {
    filterParams.author = req.query.author
  }

  if (req.query.entityId) {
    filterParams.entityId = req.query.entityId
  }

  findInteractions(filterParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: 'Error while loading interactions: ' + err.message })
    })
}

const addInteraction = (interaction: InteractionType) => async (
  { currentUser },
  res
) => {
  // Check if user has rights
  const hasRights = interactionPermission(currentUser, interaction.entity, interaction.entityType, interaction.type, 'create')
  if (!hasRights) {
    return res.status(401).json({
      error: 'Not authorized'
    })
  }

  // Make sure we include the author
  const newInteraction = { ...interaction, author: currentUser.id }
  
  // Interactions are unique
  const interactionForSameEntity = await findOneInteraction(newInteraction)
  if (interactionForSameEntity) {
    return res.status(400).json({
      error: 'Interaction already exits',
    })
  }

  try {
    const added = await createInteraction(newInteraction)
  
    res.status(200).json(added)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

const deleteInteraction = async (req, res) => {
  const interactionId = req.query.id

  if (!interactionId) {
    return res.status(400).json({
      error: 'Missing interaction id'
    })
  }

  const hasRights = interactionPermission(req.currentUser, req.query.entity, req.query['entity-type'], req.query['interaction-type'], 'delete')
  
  const existingInteraction = await findOneInteraction({
    id: interactionId
  })

  if (!existingInteraction) {
    return res.status(404).json({
      error: 'Non existing interaction'
    })
  }

  if (hasRights || existingInteraction.author === req.currentUser.id) {
    try {
      await deleteOneInteraction({
        id: interactionId
      })
  
      res.status(200).json({
        deleted: true
      })
    } catch(err) {
      res.status(500).json({
        error: err.message
      })
    }
    
  }
}

export default async (req, res) => {
  const {
    query: { sortBy, sortOrder, from, limit },
  } = req

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    logger('ERROR', 'Can not connect to db', e)
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadUser)
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getInteractions(paginationParams),
    post: addInteraction(req.body),
    delete: deleteInteraction
  })
}
