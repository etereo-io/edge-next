import { ANY_OBJECT, Request } from '@lib/types'
import {
  addContent,
  findContent,
  findOneContent,
} from '@lib/api/entities/content'
import {
  hasPermissionsForContent,
  hasPermissionsForGroupContent,
  isValidContentType,
  loadUser,
} from '@lib/api/middlewares'

import Cypher from '@lib/api/api-helpers/cypher-fields'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import { connect } from '@lib/api/db'
import { contentValidations } from '@lib/validations/content'
import { fillContentWithDefaultData } from '@lib/api/entities/content/content.utils'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onContentAdded } from '@lib/api/hooks/content.hooks'
import { purchasingPermission } from '@lib/permissions'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getContent = (filterParams, paginationParams) => async (
  req: Request,
  res
) => {
  const type = req.contentType

  const increasedFilters = {
    ...filterParams,
  }

  const isAdmin =
    req.currentUser && req.currentUser.roles.indexOf('ADMIN') !== -1
  const isOwner =
    req.currentUser &&
    filterParams.author &&
    req.currentUser.id === filterParams.author

  if (type.publishing.draftMode && !isAdmin && !isOwner) {
    // Filter by draft, except for admins and owners
    increasedFilters.draft = false
  }

  return findContent(type.slug, increasedFilters, paginationParams)
    .then(async (data) => {
      if (data.total) {
        const results = await appendInteractions({
          data: data.results,
          interactionsConfig: type.entityInteractions,
          entity: 'content',
          entityType: type.slug,
          currentUser: req.currentUser,
        })

        const decipheredData = Cypher.getDecipheredData(
          {
            type: type.slug,
            entity: 'content',
            fields: type.fields,
          },
          results,
          req.currentUser
        )

        return res.status(200).json({ ...data, results: decipheredData })
      }

      return res.status(200).json(data)
    })
    .catch((err) => {
      return res.status(500).json({
        error: 'Error while loading content ' + err.message,
      })
    })
}

const createContent = async (req: Request, res) => {
  const type = req.contentType

  const { purchasingOptions, ...rest} = req.body
  
  // Only store purchasing options if the current user has permissions
  const content = purchasingPermission(req.currentUser, type.slug, 'sell') ? {
    ...rest,
    purchasingOptions
  } : {
    ...rest
  }

  return contentValidations(type, content)
    .then(async () => {
      // Content is valid
      // Add default value to missing fields
      const newContent = fillContentWithDefaultData(
        type,
        {
          ...content,
          groupId: req.query.groupId ? req.query.groupId : null,
          groupType: req.query.groupType ? req.query.groupType : null,
        },
        req.currentUser
      )

      const cypheredData = Cypher.cypherData(type.fields, newContent)

      addContent(type.slug, cypheredData)
        .then((data) => {
          // Trigger on content added hook
          onContentAdded(data, req.currentUser)

          const [content] = Cypher.getDecipheredData(
            {
              type: type.slug,
              entity: 'content',
              fields: type.fields,
            },
            [data],
            req.currentUser
          )

          // Respond
          res.status(200).json(content)
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error while saving content ' + err.message,
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        error: 'Invalid data: ' + err.message,
      })
    })
}

export default async (req: Request, res) => {
  const {
    query: {
      type,
      sortBy,
      sortOrder,
      from,
      limit,
      author,
      tags,
      groupId,
      groupType,
    },
  } = req

  // Group filtering if not set marks it to null
  const filterParams: ANY_OBJECT = {
    groupId: groupId ? groupId : null,
    groupType: groupType ? groupType : null,
  }

  if (author) {
    filterParams.author = author
  }

  if (tags) {
    // TODO: Make tags filter generic
    filterParams['tags.slug'] = tags
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    await runMiddleware(req, res, isValidContentType(type))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
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

  try {
    if (groupId) {
      const group = await findOneContent(groupType, {
        id: groupId,
      })

      if (!group) {
        return res.status(404).json({
          error: 'Not found',
        })
      }

      await runMiddleware(
        req,
        res,
        hasPermissionsForGroupContent(groupType, type, group)
      )
    } else {
      await runMiddleware(req, res, hasPermissionsForContent(type))
    }
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  await methods(req, res, {
    get: getContent(filterParams, paginationParams),
    post: createContent,
  })
}
