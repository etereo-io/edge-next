import {
  findOneContent,
  updateOneContent,
} from '@lib/api/entities/content/content'
import {
  hasPermissionsForGroupUser,
  isValidGroupType,
  loadUser,
} from '@lib/api/middlewares'
import { connect } from '@lib/api/db'
import methods from '@lib/api/api-helpers/methods'
import { onGroupUpdated, onPendingActivity } from '@lib/api/hooks/group.hooks'
import { getGroupTypeDefinition } from '@lib/config'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { groupUserPermission } from '@lib/permissions'
import { findOneUser } from '@lib/api/entities/users/user'
import uniqBy from '@lib/uniqBy'

const loadGroupItemMiddleware = async (req, res, cb) => {
  const type = req.groupType

  const searchOptions = {}

  if (req.query.field === 'id') {
    searchOptions['id'] = req.query.slug
  } else {
    searchOptions['slug'] = req.query.slug
  }

  findOneContent(type.slug, searchOptions)
    .then((data) => {
      if (!data) {
        cb(new Error('group not found'))
      } else {
        req.item = data
        cb()
      }
    })
    .catch((err) => {
      cb(new Error('Error while loading group ' + err.message))
    })
}

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
    item: { id, author, members, pendingMembers = [] },
    item,
    currentUser,
    body,
  } = req

  const {
    user: { requireApproval },
  } = getGroupTypeDefinition(type)

  const membersCallback = (data) => {
    onGroupUpdated(data, currentUser)

    res.status(200).json(data)
  }
  const pendingMembersCallback = async (data) => {
    onGroupUpdated(data, currentUser)

    const { email } = await findOneUser({ id: author })

    onPendingActivity(data, currentUser, email, type)

    res.status(200).json(data)
  }

  if (Array.isArray(body) || body.id !== currentUser.id) {
    const canUpdate = groupUserPermission(currentUser, type, 'update', item)
    const usersToAdd = [...(Array.isArray(body) ? body : [body])]

    if (canUpdate) {
      return saveGroupUsers({
        type,
        id,
        data: {
          members: uniqBy([...members, ...usersToAdd]),
        },
        res,
        thenCallback: membersCallback,
      })
    }

    return res.status(401).json({
      error: "You don't have permissions for adding users to this group",
    })
  }

  if (body.id === currentUser.id) {
    const canJoin = groupUserPermission(currentUser, type, 'join', item)

    if (!canJoin) {
      res.status(401).json({
        error: 'You do not have permission to join this group',
      })
    } else {
      if (requireApproval) {
        return saveGroupUsers({
          type,
          id,
          data: {
            pendingMembers: uniqBy([...pendingMembers, body]),
          },
          res,
          thenCallback: pendingMembersCallback,
        })
      } else {
        return saveGroupUsers({
          type,
          id,
          data: {
            members: uniqBy([...members, body]),
          },
          res,
          thenCallback: membersCallback,
        })
      }
    }
  }
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
