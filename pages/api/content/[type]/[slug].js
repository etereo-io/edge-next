import {
  bodyParser,
  hasPermissionsForContent,
  hasPermissionsForGroupContent,
  hasQueryParameters,
  isValidContentType,
  loadUser,
} from '@lib/api/middlewares'
import {
  deleteOneContent,
  findOneContent,
  updateOneContent,
} from '@lib/api/entities/content/content'
import {
  onContentDeleted,
  onContentUpdated,
} from '@lib/api/hooks/content.hooks'

import { connect } from '@lib/api/db'
import { contentValidations } from '@lib/validations/content'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { uploadFiles } from '@lib/api/api-helpers/dynamic-file-upload'

// disable the default body parser to be able to use file upload
export const config = {
  api: {
    bodyParser: false,
  },
}

const loadContentItemMiddleware = async (req, res, cb) => {
  const type = req.contentType

  const searchOptions = {}

  // Allow to accept ID in the api call
  // by default the API wors like /api/content/post/the-content-slug but it can accept and ID if specified
  // /api/content/post/ID?field=id
  if (req.query.field === 'id') {
    searchOptions['id'] = req.query.slug
  } else {
    searchOptions['slug'] = req.query.slug
  }

  findOneContent(type.slug, searchOptions)
    .then((data) => {
      if (!data) {
        cb(new Error('Content not found'))
      } else {
        req.item = data
        cb()
      }
    })
    .catch((err) => {
      cb(new Error('Error while loading content ' + err.message))
    })
}

const getContent = async (req, res) => {
  res.status(200).json(req.item)
}

const deleteContent = (req, res) => {
  const item = req.item

  deleteOneContent(item.type, { id: item.id })
    .then(async () => {
      // Trigger on content deleted hook
      await onContentDeleted(item, req.currentUser, req.contentType)

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

const updateContent = async (req, res) => {
  const type = req.contentType

  try {
    await runMiddleware(req, res, bodyParser)
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    })
  }

  // Extract the groupId, groupType. Since we don't want anybody being able to change those.
  const { groupId, groupType, ...content } = req.body

  contentValidations(type, content)
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
        res.status(200).json(req.item)
        return
      }

      updateOneContent(type.slug, req.item.id, newContent)
        .then((data) => {
          // Trigger on updated hook
          onContentUpdated(data, req.currentUser)

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
    await runMiddleware(req, res, isValidContentType(type))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasQueryParameters(['slug']))
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
    await runMiddleware(req, res, loadContentItemMiddleware)
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
    if (req.item.groupId) {
      const group = await findOneContent(req.item.groupType, {
        id: req.item.groupId,
      })

      if (!group) {
        return res.status(404).json({
          error: 'Not found',
        })
      }

      await runMiddleware(
        req,
        res,
        hasPermissionsForGroupContent(req.item.groupType, type, group, req.item)
      )
    } else {
      await runMiddleware(req, res, hasPermissionsForContent(type, req.item))
    }
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getContent,
    del: deleteContent,
    put: updateContent,
    post: updateContent,
  })
}
