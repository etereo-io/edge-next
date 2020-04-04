import methods from '../../lib/api-helpers/methods'
import db from '../../lib/db'

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
    query: { search, sortBy, sortOrder, page, pageSize },
  } = req

  const searchParams = {
    search,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }

  methods(req, res, {
    get: getUsers(searchParams),
    post: addUser(req.body),
  })
}
