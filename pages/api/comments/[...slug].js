import methods from '../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'
import { getContentTypeDefinition } from '../../../lib/config'
import { getSession } from '../../../lib/api/auth/iron'
import { hasPermission } from '../../../lib/permissions'
import { findComments } from '../../../lib/api/comments/comments'
import { contentValidations } from '../../../lib/validations/content'

const isValidContentType = (req, res, cb) => {
  const {
    query: { slug },
  } = req

  const contentType = getContentTypeDefinition(slug[0])
  req.contentId = slug[1]

  if (!slug[0] || !contentType) {
    cb(new Error('Invalid content type'))
  } else if (!req.contentId) {
    cb(new Error('Missing comments content id'))
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
      break
    case 'POST':
    case 'PUT':
      return 'write'
      break
    case 'DELETE':
      return 'delete'
      break
    default:
      return ''
      break
  }
}

const hasPermissionsForContent = async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const permission = `content.${req.contentType.slug}.comments.${action}`

  if (!hasPermission(session, permission)) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    req.user = session
    cb()
  }
}

const getContent = (searchParams) => (req, res) => {
  const type = req.contentType

  findComments(type.slug, {
    contentId: req.contentId,
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        err: 'Error while loading content ' + err.message,
      })
    })
}

const deleteContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type,
  })
}

const updateContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type,
  })
}

const createContent = (req, res) => {
  const type = req.contentType

  const content = req.body
  console.log(content)
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
    query: { type, search, sortBy, sortOrder, page, pageSize },
  } = req

  const searchParams = {
    search,
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
    get: getContent(searchParams),
    del: deleteContent,
    put: updateContent,
    post: createContent,
  })
}
