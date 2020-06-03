import { getGroupTypeDefinition } from '../../config'

export const isValidGroupType = (type) => (req, res, cb) => {
  const groupType = getGroupTypeDefinition(type)

  if (!type || !groupType) {
    cb(new Error('Invalid group type'))
  } else {
    req.groupType = groupType
    cb()
  }
}
