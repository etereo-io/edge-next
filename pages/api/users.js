import methods from '../../lib/api/api-helpers/methods'
import db from '../../lib/api/db'

const getTestData = () => {
  return db
    .collection('test')
    .doc('test')
    .get()
    .then((doc) => {
      return doc.data()
    })
}
const getUsers = (id) => (req, res) => {
  getTestData()
    .then((testData) => {
      res.status(200).send({
        testData,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ err: err.message })
    })
}

const addUser = (user) => (req, res) => {
  // run middleware for permissions
  // Validate data
  // if fails, throw error
  res.status(200).send({
    deleted: true,
  })
}

export default (req, res) => {
  const {
    query: { search, sortBy, sortOrder, from, limit },
  } = req

  const searchParams = {
    search,
    sortBy,
    sortOrder,
    from,
    limit,
  }

  methods(req, res, {
    get: getUsers(searchParams),
    post: addUser(req.body),
  })
}
