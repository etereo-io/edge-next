import {
  createUser,
  createUserManually,
  findOneUser,
  findUsers,
  validateNewUser,
  validateNewUserFromAdminPanel,
} from '@lib/api/entities/users/user'
import { hasPermissionsForUser, loadUser } from '@lib/api/middlewares'
import { ROLES } from '@lib/constants'

import { connect } from '@lib/api/db'
import { hasPermission } from '@lib/permissions'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onUserAdded, onUserAddedManually } from '@lib/api/hooks/user.hooks'
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

const addUser = (user, fromAdminPanel = false) => async (
  { currentUser },
  res
) => {
  let parsedUser = null

  if (fromAdminPanel) {
    try {
      parsedUser = validateNewUserFromAdminPanel(user)
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      })
    }
  } else {
    try {
      parsedUser = validateNewUser(user)
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      })
    }
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
    let added = null

    if (fromAdminPanel && currentUser.roles.includes(ROLES.ADMIN)) {
      added = await createUserManually(parsedUser)

      onUserAddedManually(parsedUser, currentUser)
    } else {
      added = await createUser(parsedUser)

      onUserAdded(added)
    }

    res.status(200).send(added)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export default async (req, res) => {
  const {
    query: { search, sortBy, sortOrder, from, limit, fromAdminPanel = false },
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
