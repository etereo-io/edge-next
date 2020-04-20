import {onUserDeleted, onUserUpdated} from '../../../lib/api/hooks/user.hooks'

import methods from '../../../lib/api/api-helpers/methods'

const getUser = (id) => (req, res) => {
  res.status(200).send({
    id,
  })
}

const delUser = (id) => (req, res) => {
  onUserDeleted({
    id
  })
  res.status(200).send({
    deleted: true,
  })
}

const updateUser = (id) => (req, res) => {
  onUserUpdated({
    id
  })
  res.status(200).send({
    updated: true,
  })
}

export default (req, res) => {
  const {
    query: { id },
  } = req

  methods(req, res, {
    get: getUser(id),
    del: delUser(id),
    put: updateUser(id),
  })
}
