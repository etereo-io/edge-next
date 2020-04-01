import methods from '../../../lib/api-helpers/methods'
import runMiddleware from '../../../lib/api-helpers/run-middleware'
import { getContentType } from '../../../lib/config'
import { getSession } from '../../../lib/iron'

const isValidContentType = (req, res, cb) => {
  const {
    query: { slug },
  } = req

  const type = slug[0]
  const contentType = getContentType(type)

  if (!type || !contentType) {
    cb(new Error('Invalid content type'))
  } else {
    req.contentType = contentType
    cb()
  }
}

const hasPermissions = async(req, res, cb) => {
  const session = await getSession(req)
  // TODO: Mirar si tiene permisos para realizar la acción 
  if (!session) {
    cb(new Error('Not authorized'))
  } else {
    req.user = session
    cb()
  }
}


const getContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type,
    user: req.user
  })
}

const deleteContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type
  })
}

const updateContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type
  })
}

const createContent = (req, res) => {
  const type = req.contentType

  res.status(200).json({
    type
  })
}

export default async(req, res) => {
  
  const {
    query: {
      slug,
      search, 
      sortBy,
      sortOrder,
      page,
      pageSize
    },
  } = req

  const searchParams = {
    search,
    sortBy,
    sortOrder,
    page,
    pageSize
  }

  try {
    await runMiddleware(req, res, isValidContentType)
  } catch (e) {
    return res.status(405).json({
      message: e.message
    })
  }

  try {
    await runMiddleware(req, res, hasPermissions)
  } catch (e) {
    return res.status(401).json({
      message: e.message
    })
  }

  methods(req, res, {
    get: getContent(searchParams),
    del: deleteContent,
    put: updateContent,
    post: createContent
  })
}
