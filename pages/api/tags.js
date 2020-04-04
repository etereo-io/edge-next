import methods from '../../lib/api-helpers/methods'

const getTags = (text = (req, res) => {
  res.status(200).send([
    {
      name: 'tag',
      slug: 'tag',
    },
  ])
})

const addTag = (tag) => (req, res) => {
  // run middleware for permissions
  // Validate data
  // if fails, throw error
  res.status(200).send({
    added: true,
  })
}

export default (req, res) => {
  const {
    query: { search },
  } = req

  const searchParams = {
    search,
  }

  methods(req, res, {
    get: getTags(searchParams),
    post: addTag(req.body),
  })
}
