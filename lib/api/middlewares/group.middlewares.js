import { getGroupTypeDefinition } from '../../config'
import { findOneContent } from '../entities/content/content'

export const isValidGroupType = (type) => (req, res, cb) => {
  const groupType = getGroupTypeDefinition(type)

  if (!type || !groupType) {
    cb(new Error('Invalid group type'))
  } else {
    req.groupType = groupType
    cb()
  }
}

export const loadGroupItemMiddleware = async (req, res, cb) => {
  const type = req.groupType

  const searchOptions = {}

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
