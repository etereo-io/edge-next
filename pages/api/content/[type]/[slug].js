import methods from '../../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import { getContentTypeDefinition } from '../../../../lib/config'
import { getSession } from '../../../../lib/api/auth/iron'
import { hasPermission } from '../../../../lib/permissions'
import { findOneContent,  addContent } from '../../../../lib/api/content/content'
import { contentValidations } from '../../../../lib/validations/content'

const isValidContentType = (req, res, cb) => {
  const {
    query: { slug, type },
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
    case 'PUT':
      return 'write'
    case 'DELETE':
      return 'delete'
    default:
      return ''
  }
}

const loadContentItemMiddleware = async(req, res, cb) => {
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

const hasPermissionsForContent = async (req, res, cb) => {
  const session = await getSession(req)

  const action = getAction(req.method)
  const permission = `content.${req.contentType.slug}.${action}`

  const isOwner = session && req.item.author === session.id

  if (!hasPermission(session, permission) && !isOwner ) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    req.user = session
    cb()
  }
}

const getContent = (searchParams) => (req, res) => {
  res.status(200).json(req.item)
}

const deleteContent = (req, res) => {
  const item = req.item

  res.status(200).json({
    item
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
  .catch(err => {
    res.status(400)
      .json({
        err: 'Invalid data: ' + err.message
      })
  })

}

export default async (req, res) => {
  const {
    query: { slug, search, sortBy, sortOrder, page, pageSize },
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
    await runMiddleware(req, res, loadContentItemMiddleware)
  } catch (e) {
    return res.status(404).json({
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
