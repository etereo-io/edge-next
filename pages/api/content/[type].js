import { addContent, fillContentWithDefaultData, findContent } from '@lib/api/entities/content/content'
import {
  hasPermissionsForContent,
  isValidContentType,
  loadUser,
} from '@lib/api/middlewares'

import { connect } from '@lib/api/db'
import { contentValidations } from '@lib/validations/content'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onContentAdded } from '@lib/api/hooks/content.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getContent = (filterParams, searchParams, paginationParams) => (
  req,
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

  findContent(type.slug, increasedFilters, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while loading content ' + err.message,
      })
    })
}


const createContent = async (req, res) => {
  const type = req.contentType
  const content = req.body

  contentValidations(type, content)
    .then(async () => {
      // Content is valid
      // Add default value to missing fields
      const newContent = fillContentWithDefaultData(
        type,
        content,
        req.currentUser
      )

      addContent(type.slug, newContent)
        .then((data) => {
          // Trigger on content added hook
          onContentAdded(data, req.currentUser)

          // Respond
          res.status(200).json(data)
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

export default async (req, res) => {
  const {
    query: { type, search, sortBy, sortOrder, from, limit, author, tags },
  } = req

  const filterParams = {}

  if (author) {
    filterParams.author = author
  }

  if (tags) {
    // TODO: Make tags filter generic
    filterParams['tags.slug'] = tags
  }

  const searchParams = {
    search,
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
      message: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    logger('ERROR', 'Can not connect to db', e)
    return res.status(500).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadUser)
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent(type))
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getContent(filterParams, searchParams, paginationParams),
    post: createContent,
  })
}
