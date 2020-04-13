import methods from '../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'
import { getContentTypeDefinition } from '../../../lib/config'
import { getSession } from '../../../lib/api/auth/iron'
import { hasPermission } from '../../../lib/permissions'
import { findContent, addContent } from '../../../lib/api/content/content'
import { contentValidations } from '../../../lib/validations/content'

const isValidContentType = (req, res, cb) => {
  const {
    query: { type },
  } = req

  const contentType = getContentTypeDefinition(type)

  if (!type || !contentType) {
    cb(new Error('Invalid content type'))
  } else {
    req.contentType = contentType
    cb()
  }
}

const getAction = (method) => {
  // TODO: See how to handle actions for updating documents from other users
  switch (method) {
    case 'GET':
      return 'read'
    case 'POST':
      return 'write'
    default:
      return ''
  }
}

const hasPermissionsForContent = async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const permission = `content.${req.contentType.slug}.${action}`

  if (!hasPermission(session, permission)) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    req.user = session
    cb()
  }
}

const getContent = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  const type = req.contentType

  findContent(type.slug, filterParams, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        err: 'Error while loading content ' + err.message,
      })
    })
}

const createContent = (req, res) => {
  const type = req.contentType

  const content = req.body
  
  contentValidations(type, content)
    .then(() => {
      // Content is valid
      addContent(type.slug, req.body)
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
    query: { type, search, sortBy, sortOrder, page, pageSize, author },
  } = req

  const filterParams = {
    author,
  }

  const searchParams = {
    search,
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    page,
    pageSize,
  }

  try {
    await runMiddleware(req, res, isValidContentType)
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent)
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
