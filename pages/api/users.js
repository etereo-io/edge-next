import { createUser, findOneUser, findUsers, validateUser } from '../../lib/api/users/user'
import methods, { getAction } from '../../lib/api/api-helpers/methods'

import { connect } from '../../lib/api/db'
import { getSession } from '../../lib/api/auth/iron'
import { hasPermission } from '../../lib/permissions'
import { onUserAdded } from '../../lib/api/hooks/user.hooks'
import runMiddleware from '../../lib/api/api-helpers/run-middleware'

const hasPermissionsForUsers = async (req, res, cb) => {
  const session = await getSession(req)
  const action = getAction(req.method)

  const permission = [`user.${action}`, `user.admin`]

  const canAccess = hasPermission(session, permission)

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    cb()
  }
}

const getUsers = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  findUsers(filterParams, searchParams, paginationParams)
    .then((docs) => {
      res.status(200).json(docs)
    })
    .catch((err) => {
      res.status(500).json({ err: 'Error while loading users: ' + err.message })
    })
}

const addUser = (user) => async (req, res) => {
  // TODO : run middleware for permissions
  
  
  try {
    validateUser(user)
  } catch(err) {
    return res.status(400).json({
      error: err.message
    })
  }
  
  const userWithSameEmail = await findOneUser({email: user.email})

  if (userWithSameEmail) {
    return res.status(400).json({
      error: 'email already taken'
    })
  }

  const userWithUserName = await findOneUser({username: user.username})
  if (userWithUserName) {
    return res.status(400).json({
      error: 'Username already taken'
    })
  }

  try {
    const added = await createUser(user)
    onUserAdded(added)
    // TODO: Log in the user

    res.status(200).send({
      created: true
    })
  } catch(err) {
    res.status(500).json({
      error: err.message
    })
  }

 
}

export default async (req, res) => {
  const {
    query: { search, sortBy, sortOrder, from, limit },
  } = req

  const filterParams = {}

  const searchParams = {
    search,
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForUsers)
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getUsers(filterParams, searchParams, paginationParams),
    post: addUser(req.body),
  })
}
