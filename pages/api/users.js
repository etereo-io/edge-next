import methods from '../../lib/api-helpers/methods'

const getUsers = (id) => (req, res) => {
  res.status(200).send({
    id
  })
}

const addUser = (user) => (req, res) => {
  // run middleware for permissions
  // Validate data
  // if fails, throw error
  res.status(200).send({
    deleted: true
  })
}


export default (req, res) => {
  const {
    query: {
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

  methods(req, res, {
    get: getUsers(searchParams),
    post: addUser(req.body)
  })
}
