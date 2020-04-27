import { connect } from '../../../lib/api/db'
import { findActivity } from '../../../lib/api/activity/activity'
import { findOneUser } from '../../../lib/api/users/user'
import { getSession } from '../../../lib/api/auth/iron'
import { hasPermission } from '../../../lib/permissions'
import methods from '../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'

const hasPermissionForActivity = async (req, res, cb) => {
  const session = await getSession(req)

  const permission = [`activity.content.created`, `activity.comments.created`]

  // If there is a item we need to check also if the content owner is the current user
  const isOwner = session && req.userId === session.id
  const canAccess = hasPermission(session, permission) || isOwner

  if (!canAccess) {
    cb(new Error('User not authorized to ' + permission))
  } else {
    cb()
  }
}

const userExist = userId => async (req, res, cb) => {
  const user = await findOneUser({id: userId})

  if(!user) {
    cb(new Error('User not found'))
  } else {
    req.user = user
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
        err: 'Error while loading activities ' + err.message,
      })
    })
}


export default async (req, res) => {
  const {
    query: { userId, sortBy, sortOrder, from, limit },
  } = req

  const filterParams = {
    author: userId
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
    console.log(e)
    return res.status(500).json({
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

  try {
    await runMiddleware(req, res, hasPermissionForActivity)
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getActivities(filterParams, searchParams, paginationParams),
  })
}
