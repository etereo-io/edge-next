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
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { onGroupUpdated } from '@lib/api/hooks/group.hooks'

const loadGroupItemMiddleware = async (req, res, cb) => {
  const {
    groupType,
    query: { field, slug },
  } = req

  const searchOptions = {}

  if (field === 'id') {
    searchOptions['id'] = slug
  } else {
    searchOptions['slug'] = slug
  }

  findOneContent(groupType.slug, searchOptions)
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

const addMember = async (req, res) => {
  const {
    query: {
      type: { slug },
      body,
      item: { id },
      currentUser,
    },
  } = req

  updateOneContent(slug, id, {
    members: [...req.item.members, body],
  })
    .then((data) => {
      // Trigger on updated hook
      onGroupUpdated(data, currentUser)

      // Respond
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while saving content ' + err.message,
      })
    })
}

async function updateMember() {}

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

  try {
    await runMiddleware(req, res, hasPermissionsForGroupUser(type, req.item))
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  methods(req, res, {
    post: addMember,
    put: updateMember,
  })
}
