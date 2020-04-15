import methods from '../../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import { findOneContent, updateOneContent } from '../../../../lib/api/content/content'
import { contentValidations } from '../../../../lib/validations/content'
import { isValidContentType, hasQueryParameters, hasPermissionsForContent } from '../../../../lib/api/middlewares'

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

const getContent = (req, res) => {
  res.status(200).json(req.item)
}

const deleteContent = (req, res) => {
  const item = req.item

  res.status(200).json({
    item,
  })
}

const updateContent = (req, res) => {
  const type = req.contentType

  const content = req.body
  
  contentValidations(type, content)
    .then(() => {
      // Content is valid
      updateOneContent(type.slug, req.item.id, req.body)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((err) => {
          res.status(500).json({
            err: 'Error while saving content ' + err.message,
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        err: 'Invalid data: ' + err.message,
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
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasQueryParameters(['slug']))
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadContentItemMiddleware)
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent(req.item))
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getContent,
    del: deleteContent,
    put: updateContent,
    post: updateContent,
  })
}
