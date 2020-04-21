import {onUserDeleted, onUserUpdated} from '../../../lib/api/hooks/user.hooks'

import { findOneUser } from '../../../lib/api/users/user'
import methods from '../../../lib/api/api-helpers/methods'

const getUser = (id) => (req, res) => {
  findOneUser(id)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).send('User not found')
      }
    })
    .catch(err => {
      res.status(500).send(err.message)
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
