import methods from '../../../lib/api-helpers/methods'

const getUser = (id) => (req, res) => {
  res.status(200).send({
    id,
  })
}

const delUser = (id) => (req, res) => {
  res.status(200).send({
    deleted: true,
  })
}

const updateUser = (id) => (req, res) => {
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
