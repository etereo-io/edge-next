import {
  deleteOneComment,
  findOneComment,
  updateOneComment,
} from '@lib/api/comments/comments'
import {
  hasPermissionsForComment,
  hasQueryParameters,
  isValidContentType,
} from '@lib/api/middlewares'
import {
  onCommentDeleted,
  onCommentUpdated,
} from '@lib/api/hooks/comment.hooks'

import { connect } from '@lib/api/db'
import { contentValidations } from '@lib/validations/content'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

const loadCommentItemMiddleware = async (req, res, cb) => {
  const searchOptions = {
    type: req.query.type,
    contentSlug: req.query.contentSlug,
  }

  // By default filter by comment slug
  if (req.query.field && req.query.field === 'id') {
    searchOptions['id'] = req.query.id
  } else {
    searchOptions['slug'] = req.query.id
  }

  findOneComment(searchOptions)
    .then((data) => {
      if (!data) {
        cb(new Error('Content not found'))
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
      deleted: true
    })
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    }) 
  }

}

const updateComment = (req, res) => {
  const type = req.contentType

  const content = req.body

  contentValidations(type, content)
    .then(() => {
      // Content is valid
      updateOneContent(type.slug, req.item.id, req.body)
        .then((data) => {
          // Trigger hook
          onCommentUpdated(req.item, req.currentUser)

          // Respond
          res.status(200).json(data)
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error while saving content ' + err.message,
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        error: 'Invalid data: ' + err.message,
      })
    })
}

export default async (req, res) => {
  const {
    query: { contentType, search, sortBy, sortOrder, from, limit },
  } = req

  const searchParams = {
    search,
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    await runMiddleware(req, res, isValidContentType(contentType))
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(
      req,
      res,
      hasQueryParameters(['contentType', 'contentId', 'id'])
    )
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    // console.log(e)
    return res.status(500).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadCommentItemMiddleware)
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(
      req,
      res,
      hasPermissionsForComment(contentType, req.item)
    )
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getComment,
    del: deleteComment,
    put: updateComment,
    post: updateComment,
  })
}
