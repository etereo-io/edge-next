import { addContent, fillContentWithDefaultData, findContent } from '@lib/api/entities/content/content'
import {
  hasPermissionsForGroup,
  isValidGroupType,
  loadUser,
} from '@lib/api/middlewares'

import { connect } from '@lib/api/db'
import { contentValidations } from '@lib/validations/content'
import methods from '@lib/api/api-helpers/methods'
import { onGroupAdded } from '@lib/api/hooks/group.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getGroups = (filterParams, paginationParams, member) => (
  req,
  res
) => {
  const type = req.groupType

  const increasedFilters = {
    ...filterParams,
  }

  if (member) {
    // Filter by member
    increasedFilters.members = { $elemMatch : { id : member }}
  }

  findContent(type.slug, increasedFilters, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while loading content ' + err.message,
      })
    })
}


const createGroup = async (req, res) => {
  const type = req.groupType
  const content = req.body

  contentValidations(type, content)
    .then(async () => {
      // Content is valid
      // Add default value to missing fields
      const newContent = fillContentWithDefaultData(
        type,
        {
          ...content,
          members: [{
            id: user.id,
            role: 'GROUP_ADMIN'
          }],
        },
        req.currentUser
      )

      addContent(type.slug, newContent)
        .then((data) => {
          // Trigger on content added hook
          onGroupAdded(data, req.currentUser)

          // Respond
          res.status(200).json(data)
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error while saving group ' + err.message,
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
    query: { type, sortBy, sortOrder, from, limit, author, member },
  } = req

  const filterParams = {}

  if (author) {
    filterParams.author = author
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    await runMiddleware(req, res, isValidGroupType(type))
  } catch (e) {
    // console.log(e)
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    // console.log(e)
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
    await runMiddleware(req, res, hasPermissionsForGroup(type))
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getGroups(filterParams, paginationParams, member),
    post: createGroup,
  })
}
