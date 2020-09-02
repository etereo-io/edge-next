import {
  bodyParser,
  hasPermissionsForGroup,
  isValidGroupType,
  loadUser,
} from '@lib/api/middlewares'
import {
  deleteOneContent,
  fillContent,
  findOneContent,
  updateOneContent,
} from '@lib/api/entities/content'
import {
  onGroupDeleted,
  onGroupUpdated,
} from '@lib/api/hooks/group.hooks'

import { connect } from '@lib/api/db'
import { groupValidations } from '@lib/validations/group'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { uploadFiles } from '@lib/api/api-helpers/dynamic-file-upload'

// disable the default body parser to be able to use file upload
export const config = {
  api: {
    bodyParser: false,
  },
}

const loadGroupItemMiddleware = async (req, res, cb) => {
  const type = req.groupType

  const searchOptions = {}

  // Allow to accept ID in the api call
  // by default the API wors like /api/group/grouptype/the-group-slug but it can accept and ID if specified
  // /api/group/grouptype/ID?field=id
  if (req.query.field === 'id') {
    searchOptions['id'] = req.query.slug
  } else {
    searchOptions['slug'] = req.query.slug
  }

  findOneContent(type.slug, searchOptions)
    .then((data) => {
      if (!data) {
        cb(new Error('group not found'))
      } else {
        req.item = data
        cb()
      }
    })
    .catch((err) => {
      cb(new Error('Error while loading group ' + err.message))
    })
}

const getGroup = async (req, res) => {
  res.status(200).json(req.item)
}

const deleteGroup = (req, res) => {
  const item = req.item

  deleteOneContent(item.type, { id: item.id })
    .then(async () => {
      // Trigger on content deleted hook
      await onGroupDeleted(item, req.currentUser, req.groupType)

      res.status(200).json({
        deleted: true,
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      })
    })
}

const updateGroup = async (req, res) => {
  try {
    await runMiddleware(req, res, bodyParser)
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    })
  }

  const type = req.groupType

  const content = {
    ...req.body,
  }

  groupValidations(type, content)
    .then(async () => {
      // Content is valid

      const newContent = await uploadFiles(
        type.fields,
        req.files,
        type.slug,
        req.item,
        content
      )
      
      if (Object.keys(newContent).length === 0) {
        // It is an empty request, no file was uploaded, no file was deleted)
        const filled = await fillContent(req.item)
        res.status(200).json(filled)
        return
      }

      updateOneContent(type.slug, req.item.id, newContent)
        .then((data) => {
          // Trigger on updated hook
          onGroupUpdated(data, req.currentUser)

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
    query: { type },
  } = req

  try {
    await runMiddleware(req, res, isValidGroupType(type))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
  }


  try {
    // Connect to database
    await connect()
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadGroupItemMiddleware)
  } catch (e) {
    return res.status(404).json({
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
    await runMiddleware(req, res, hasPermissionsForGroup(type, req.item))
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getGroup,
    del: deleteGroup,
    put: updateGroup,
    post: updateGroup,
  })
}
