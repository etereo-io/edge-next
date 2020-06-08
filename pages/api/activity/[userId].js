import { connect } from '@lib/api/db'
import { findActivity } from '@lib/api/entities/activity/activity'
import { findOneUser } from '@lib/api/entities/users/user'
import { getSession } from '@lib/api/auth/iron'
import { hasPermission } from '@lib/permissions'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const hasPermissionForActivity = async (req, res, cb) => {
  const session = await getSession(req)

  const permission = [`activity.read`, `activity.admin`]

  // If there is a item we need to check also if the content owner is the current user
  const isOwner = session && req.userId === session.id
  const canAccess = hasPermission(session, permission) || isOwner

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    cb()
  }
}

const userExist = (userId) => async (req, res, cb) => {
  const user = await findOneUser({ id: userId })

  if (!user) {
    cb(new Error('User not found'))
  } else {
    cb()
  }
}

const getActivities = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  findActivity(filterParams, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while loading activities ' + err.message,
      })
    })
}

export default async (req, res) => {
  const {
    query: { userId, sortBy, sortOrder, from, limit },
  } = req

  const filterParams = {
    author: userId,
  }

  const searchParams = {
    // TODO: implement filter activities
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
    await runMiddleware(req, res, userExist(userId))
  } catch (e) {
    
    return res.status(404).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionForActivity)
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getActivities(filterParams, searchParams, paginationParams),
  })
}
