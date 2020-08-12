import { updateOneContent } from '@lib/api/entities/content/content'
import {
  isValidGroupType,
  loadUser,
  loadGroupItemMiddleware,
} from '@lib/api/middlewares'
import { connect } from '@lib/api/db'
import methods from '@lib/api/api-helpers/methods'
import {
  onGroupUpdated,
  onGroupJoinDisapprove,
} from '@lib/api/hooks/group.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { groupUserPermission } from '@lib/permissions'
import uniqBy from '@lib/uniqBy'
import { getPermittedFields } from '@lib/validations/group/users'
import { UPDATE_GROUP_USER_ACTIONS } from '@lib/constants'

function updateUsers({ type, id, data, callback, res }) {
  updateOneContent(type, id, data)
    .then(callback)
    .catch((err) => {
      res.status(500).json({
        error: 'Error while saving content ' + err.message,
      })
    })
}

function removeUser(req, res) {
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

  updateUsers({
    type,
    res,
    id,
    callback: (data) => {
      onGroupJoinDisapprove(
        { ...data, oldMembers, oldPendingMembers },
        currentUser
      )

      res.status(200).json(data)
    },
    data: { members, pendingMembers },
  })
}

async function updateUser(req, res) {
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

  updateUsers({
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

export default async (req, res) => {
  const {
    query: { type, userId },
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

  // Has permissions to update members
  const canUpdate =
    userId !== currentUser.id &&
    groupUserPermission(currentUser, type, 'update', item)

  if (!canUpdate) {
    return res.status(401).json({
      error: 'Not authorized',
    })
  }

  methods(req, res, {
    put: updateUser,
    del: removeUser,
  })
}
