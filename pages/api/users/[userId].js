import { findOneUser, updateOneUser } from '../../../lib/api/users/user'
import methods, { getAction } from '../../../lib/api/api-helpers/methods'
import { onUserDeleted, onUserUpdated } from '../../../lib/api/hooks/user.hooks'

import { connect } from '../../../lib/api/db'
import { getSession } from '../../../lib/api/auth/iron'
import { hasPermission } from '../../../lib/permissions'
import { hasPermissionsForUser } from '../../../lib/api/middlewares'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'

const userExist = (userId) => async (req, res, cb) => {
  if (userId === 'me') {
    try {
      const session = await getSession(req)

      if (!session) {
        cb(new Error('User not found'))
      } else {
        req.user = session
        cb()
      }
    } catch (e) {
      cb(new Error('Error while getting current user'))
    }
  } else {
    const user = await findOneUser({ id: userId })

    if (!user) {
      cb(new Error('User not found'))
    } else {
      req.user = user
      cb()
    }
  }
}

const getUser = (req, res) => {
  // TODO: Hide private fields
  res.status(200).json(req.user)
}

const delUser = (req, res) => {
  // TODO: implement
  onUserDeleted(req.user)
  res.status(200).send({
    deleted: true,
  })
}

const updateUser = (req, res) => {
  updateOneUser(req.user.id, req.body)
    .then(() => {
      // Invoke the hook
      onUserUpdated(req.user)

      res.status(200).send({
        updated: true,
      })
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      })
    })
}

export default async (req, res) => {
  const {
    query: { userId },
  } = req

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
    await runMiddleware(req, res, hasPermissionsForUser(userId))
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, userExist(userId))
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getUser,
    del: delUser,
    put: updateUser,
  })
}
