import {
  isValidGroupType,
  loadGroupItemMiddleware,
  loadUser,
} from '@lib/api/middlewares'
import {
  onGroupJoinDisapprove,
  onGroupUpdated,
} from '@lib/api/hooks/group.hooks'
import { Request } from '@lib/types'
import { UPDATE_GROUP_USER_ACTIONS } from '@lib/constants'
import { connect } from '@lib/api/db'
import { getPermittedFields } from '@lib/validations/group/users'
import { groupUserPermission } from '@lib/permissions'
import methods, { getAction } from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import uniqBy from '@lib/uniqBy'
import { updateOneContent } from '@lib/api/entities/content'

async function updateUsers({ type, id, data, callback, res }) {
  return updateOneContent(type, id, data)
    .then(callback)
    .catch((err) => {
      res.status(500).json({
        error: 'Error while saving content ' + err.message,
      })
    })
}

async function removeUser(req: Request, res) {
  const {
    query: { type, userId },
    item: { id, members: oldMembers, pendingMembers: oldPendingMembers = [] },
    currentUser,
  } = req

  // particular user can be only in the one of the following fields: members, pendingMembers. so we should find user with that id in the one of the lists
  const members = oldMembers.filter(({ id: memberId }) => memberId !== userId)
  const pendingMembers = oldPendingMembers.filter(
    ({ id: memberId }) => memberId !== userId
  )

  return updateUsers({
    type,
    res,
    id,
    callback: (data) => {
      onGroupJoinDisapprove({ ...data, userId }, currentUser)

      return res.status(200).json(data)
    },
    data: { members, pendingMembers },
  })
}

async function updateUser(req: Request, res) {
  const {
    query: { type, action, userId },
    item: {
      id,
      members: oldMembers = [],
      pendingMembers: oldPendingMembers = [],
    },
    currentUser,
    body,
  } = req

  let data

  // if action is approve then we have to move users from pending members list to members list. otherwise we update members list
  switch (action) {
    case UPDATE_GROUP_USER_ACTIONS.APPROVE:
      data = getMovedToMembersList({
        body,
        userId,
        oldMembers,
        oldPendingMembers,
      })

      break
    default:
      data = { members: uniqBy([body, ...oldMembers].map(getPermittedFields)) }
  }

  return updateUsers({
    type,
    res,
    id,
    callback: (response) => {
      onGroupUpdated(data, currentUser)

      res.status(200).json(response)
    },
    data,
  })
}

function getMovedToMembersList({
  body,
  userId,
  oldMembers,
  oldPendingMembers,
}): { members: Array<object>; pendingMembers: Array<object> } {
  const members = uniqBy([body, ...oldMembers].map(getPermittedFields))
  const pendingMembers = oldPendingMembers.filter(({ id }) => id !== userId)

  return { members, pendingMembers }
}

export default async (req: Request, res) => {
  const {
    query: { type, userId },
    method,
  } = req

  try {
    await runMiddleware(req, res, isValidGroupType(type))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadGroupItemMiddleware)
  } catch (e) {
    return res.status(404).json({
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

  const { item, currentUser } = req

  // Has permissions to update/delete members
  const hasAccess =
    userId !== currentUser.id &&
    groupUserPermission(currentUser, type, getAction(method), item)

  if (!hasAccess) {
    return res.status(401).json({
      error: 'Not authorized',
    })
  }

  await methods(req, res, {
    put: updateUser,
    del: removeUser,
  })
}
