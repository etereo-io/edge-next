import {
  isValidGroupType,
  loadGroupItemMiddleware,
  loadUser,
} from '@lib/api/middlewares'
import { onGroupJoinRequest, onGroupUpdated } from '@lib/api/hooks/group.hooks'

import { connect } from '@lib/api/db'
import { findOneUser } from '@lib/api/entities/users/user'
import { getGroupTypeDefinition } from '@lib/config'
import { getPermittedFields } from '@lib/validations/group/users'
import { groupUserPermission } from '@lib/permissions'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import uniqBy from '@lib/uniqBy'
import { updateOneContent } from '@lib/api/entities/content/content'

const getUsers = async ({ item: { members } }, res) => {
  res.status(200).json(members)
}

function saveGroupUsers({ type, id, data, thenCallback, res }) {
  updateOneContent(type, id, data)
    .then(thenCallback)
    .catch((err) => {
      res.status(500).json({
        error: 'Error while saving content ' + err.message,
      })
    })
}

async function addUsers(req, res) {
  const {
    query: { type },
    item: {
      id,
      author,
      members: oldMembers,
      pendingMembers: oldPendingMembers = [],
    },
    item,
    currentUser,
    body,
  } = req

  const {
    user: { requireApproval },
    roles,
  } = getGroupTypeDefinition(type)
  const [role] = roles

  const membersCallback = (data) => {
    onGroupUpdated(data, currentUser)

    res.status(200).json(data)
  }
  const pendingMembersCallback = async (data) => {
    const { email } = await findOneUser({ id: author })

    onGroupJoinRequest(data, currentUser, email, type)

    res.status(200).json(data)
  }

  // Has permissions to update members
  const canUpdate =
    (body.id !== currentUser.id || Array.isArray(body)) &&
    groupUserPermission(currentUser, type, 'update', item)

  // Has permissions to join the group and is trying to add itself
  const canJoin =
    body.id === currentUser.id &&
    groupUserPermission(currentUser, type, 'join', item)

  if (!canJoin && !canUpdate) {
    return res.status(401).json({
      error: 'Not authorized',
    })
  }

  // Used to determine if the user goes to pending users
  const membersRequireApproval = requireApproval && !canUpdate
  const usersToAdd = [...(Array.isArray(body) ? body : [body])]

  const pendingMembers = uniqBy(
    [...usersToAdd, ...oldPendingMembers]
      .map(getPermittedFields)
      .map((item) => {
        // set default role
        item.roles = [role.value]

        return item
      })
  )
  const members = uniqBy(usersToAdd.map(getPermittedFields))
  const data = membersRequireApproval ? { pendingMembers } : { members }

  return saveGroupUsers({
    type,
    id,
    data,
    res,
    thenCallback: membersRequireApproval
      ? pendingMembersCallback
      : membersCallback,
  })
}

export default async (req, res) => {
  const {
    query: { type },
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

  methods(req, res, {
    get: getUsers,
    post: addUsers,
  })
}
