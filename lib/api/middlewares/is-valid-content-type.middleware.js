import { getContentTypeDefinition } from '../../config'

export default (type) => (req, res, cb) => {
  const contentType = getContentTypeDefinition(type)

  if (!type || !contentType) {
    cb(new Error('Invalid content type'))
  } else {
    req.contentType = contentType
    cb()
  }
}