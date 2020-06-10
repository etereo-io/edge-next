import {
  deleteOneComment,
  findOneComment,
} from '@lib/api/entities/comments/comments'
import {
  hasPermissionsForComment,
  hasPermissionsForGroupComment,
  loadUser,
} from '@lib/api/middlewares'

import { connect } from '@lib/api/db'
import {
  findOneContent,
} from '@lib/api/entities/content/content'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onCommentDeleted } from '@lib/api/hooks/comment.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const loadCommentItemMiddleware = async (req, res, cb) => {
  const searchOptions = {}

  // By default filter by comment slug
  if (req.query.field && req.query.field === 'id') {
    searchOptions['id'] = req.query.id
  } else {
    searchOptions['slug'] = req.query.id
  }

  findOneComment(searchOptions)
    .then((data) => {
      if (!data) {
        cb(new Error('comment not found'))
      } else {
        req.item = data
        cb()
      }
    })
    .catch((err) => {
      cb(new Error('Error while loading content ' + err.message))
    })
}

const getComment = (req, res) => {
  res.status(200).json(req.item)
}

const deleteComment = async (req, res) => {
  const item = req.item
  try {
    await deleteOneComment({ id: item.id })

    // Trigger hook
    await onCommentDeleted(item, req.currentUser)

    res.status(200).json({
      deleted: true,
    })
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export default async (req, res) => {
  const {
    query: { id },
  } = req

  if (!id) {
    return res.status(405).json({
      error: 'Missing comment id',
    })
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
    await runMiddleware(req, res, loadCommentItemMiddleware)
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    })
  }

  try {
    if (req.item.groupId) {
      // Check permissions in the group 
      const group  = await findOneContent({
        id: req.item.groupId, 
        type: req.item.groupType
      })
      if (!group) {
        await runMiddleware(req, res, hasPermissionsForComment(req.item.contentType, req.item))
      } else {
        await runMiddleware(req, res, hasPermissionsForGroupComment(group.type, req.item.contentType, group, req.item))
      }
      
    } else {
      await runMiddleware(req, res, hasPermissionsForComment(req.item.contentType, req.item))
    }
  } catch (e) {

    return res.status(401).json({
      error: e.message,
    })
  }


  methods(req, res, {
    get: getComment,
    del: deleteComment,
    put: (req, res) => {
      res.status(401).json({ error: 'Action not authorized' })
    },
    post: (req, res) => {
      res.status(401).json({ error: 'Action not authorized' })
    },
  })
}
