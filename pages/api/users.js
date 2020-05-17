import {
  createUser,
  findOneUser,
  findUsers,
  validateNewUser,
} from '@lib/api/users/user'

import { connect } from '@lib/api/db'
import { hasPermission } from '@lib/permissions'
import { hasPermissionsForUser } from '@lib/api/middlewares'
import { hidePrivateUserFields } from '@lib/api/users/user.utils'
import methods from '@lib/api/api-helpers/methods'
import { onUserAdded } from '@lib/api/hooks/user.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getUsers = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {

  const permission = [`user.admin`]
  const showPrivateFields = hasPermission(req.currentUser, permission)

  findUsers(filterParams, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json({
        ...data,
        results: showPrivateFields ? data.results: data.results.map(hidePrivateUserFields)
      })
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: 'Error while loading users: ' + err.message })
    })
}

const addUser = (user) => async (req, res) => {
  let parsedUser = null

  try {
    parsedUser = validateNewUser(user)
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    })
  }

  const userWithSameEmail = await findOneUser({ email: parsedUser.email })

  if (userWithSameEmail) {
    return res.status(400).json({
      error: 'Email already taken',
    })
  }

  const userWithUserName = await findOneUser({ username: parsedUser.username })
  if (userWithUserName) {
    return res.status(400).json({
      error: 'Username already taken',
    })
  }

  try {
    const added = await createUser(parsedUser)

    onUserAdded(added)

    res.status(200).send(added)
  } catch (err) {
    res.status(500).json({
      error: err.message,
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
    await runMiddleware(req, res, hasPermissionsForUser())
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
