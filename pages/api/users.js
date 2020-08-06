import {
  createUser,
  findOneUser,
  findUsers,
  validateNewUser,
} from '@lib/api/entities/users/user'
import { hasPermissionsForUser, loadUser } from '@lib/api/middlewares'

import { connect } from '@lib/api/db'
import { hasPermission } from '@lib/permissions'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onUserAdded } from '@lib/api/hooks/user.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const getUsers = (filterParams, paginationParams) => (req, res) => {
  const permission = [`user.admin`]
  const showPrivateFields = hasPermission(req.currentUser, permission)

  findUsers(filterParams, paginationParams)
    .then((data) => {
      res.status(200).json({
        ...data,
        results: showPrivateFields
          ? data.results
          : data.results.map(hidePrivateUserFields),
      })
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: 'Error while loading users: ' + err.message })
    })
}

const addUser = (user) => async (
  { currentUser },
  res
) => {
  let parsedUser = null

  const currentUserHasAdministrationRights = hasPermission(currentUser,  [`user.admin`, `user.update`])

  if (user.roles || user.profile) {
    // Is a user being created manually, not a signup. People who signup can not chose their own roles or add profile information
    if (!currentUserHasAdministrationRights) {
      return res.status(401).json({
        error: 'Unauthorized to create users with roles or profile information.'
      })
    }
  }

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

  const userWithUserName = await findOneUser({
    username: parsedUser.username,
  })
  if (userWithUserName) {
    return res.status(400).json({
      error: 'Username already taken',
    })
  }

  try {
    const added = await createUser(parsedUser, currentUserHasAdministrationRights)
    onUserAdded(added, currentUser)

    res.status(200).send(hidePrivateUserFields(added))
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export default async (req, res) => {
  const {
    query: { search, sortBy, sortOrder, from, limit},
  } = req

  const filterParams = {}

  if (search) {
    filterParams['$or'] = [
      { email: { $regex: search } },
      { username: { $regex: search } },
    ]
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
    logger('ERROR', 'Can not connect to db', e)
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadUser)
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForUser())
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getUsers(filterParams, paginationParams),
    post: addUser(req.body, fromAdminPanel),
  })
}
