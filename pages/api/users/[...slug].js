import { findOneUser, updateOneUser } from '../../../lib/api/users/user'
import { onUserDeleted, onUserUpdated } from '../../../lib/api/hooks/user.hooks'

import { connect } from '../../../lib/api/db'
import { getSession } from '../../../lib/api/auth/iron'
import { hasPermissionsForUser } from '../../../lib/api/middlewares'
import methods from '../../../lib/api/api-helpers/methods'
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

const updateUser = (slug) => (req, res) => {
  const updateData = slug[1]
  let promiseChange = null

  switch (updateData) {
    case 'profile':
      /* Update only profile data */
      promiseChange = updateOneUser(req.user.id, { profile: {
        ...req.user.profile,
        ...req.body.profile
      } })
      break
    case 'username':
      /* Update only username */
      promiseChange = findOneUser({ username: req.body.username }).then(
        (maybeUser) => {
          if (!maybeUser) {
            return updateOneUser(req.user.id, { username: req.body.username })
          } else {
            throw new Error('Username already exists')
          }
        }
      )
      break
    case 'email':
      /* Update only email */
      promiseChange = findOneUser({ email: req.body.email }).then(
        (maybeUser) => {
          if (!maybeUser) {
            return updateOneUser(req.user.id, { email: req.body.email })
          } else {
            throw new Error('email already exists')
          }
        }
      )
      break

    case 'block':
        /* Update only blocked status */
        promiseChange = updateOneUser(req.user.id, {
          blocked: req.body.blocked,
        })
        break

    case 'password':
      /* Update only password */
      // TODO: Check that the current password req.body.password matches the old one
      promiseChange = updateOneUser(req.user.id, {
        password: req.body.newpassword,
      })
      break
    default:
      promiseChange = Promise.reject('Update ' + updateData + ' not allowed')
  }

  promiseChange
    .then((newUser) => {
      // Invoke the hook
      onUserUpdated(newUser, updateData)

      res.status(200).send({
        updated: true,
      })
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      })
    })
}

export default async (req, res) => {
  const {
    query: { slug },
  } = req

  const userId = slug[0]

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
    put: updateUser(slug),
  })
}
