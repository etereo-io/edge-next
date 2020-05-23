import { addComment, findComments } from '@lib/api/entities/comments/comments'
import {
  hasPermissionsForComment,
  hasQueryParameters,
  isValidContentType,
} from '@lib/api/middlewares'

import { commentValidations } from '@lib/validations/comment'
import { connect } from '@lib/api/db'
import methods from '@lib/api/api-helpers/methods'
import { onCommentAdded } from '@lib/api/hooks/comment.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import slugify from 'slugify'

// Check that the comments are allowed for this content type
function contentTypeAllowsCommentsMiddleware(req, res, cb) {
  if (!req.contentType.comments.enabled) {
    cb(
      new Error(
        'Content type ' + req.contentType.slug + ' does not allow comments'
      )
    )
  } else {
    cb()
  }
}

const getComments = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  findComments(filterParams, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while loading content ' + err.message,
      })
    })
}

export function fillCommentWithDefaultData(
  contentType,
  contentId,
  comment,
  user
) {
  try {
    // TODO: Parse message to extract mentions, links, images, etc
    // Best way to store mentions https://stackoverflow.com/questions/31821751/best-way-to-store-comments-with-mentions-firstname-in-database

    // Fill in the mandatory data like author, date, type
    const newComment = {
      author: user.id,
      createdAt: Date.now(),
      contentType: contentType.slug,
      contentId: contentId,
      message: comment.message,
      conversationId: comment.conversationId || null,
    }

    const slug = slugify(newComment.createdAt + ' ' + newComment.author, {
      lower: true,
      strict: true,
    })

    const extraFields = {
      slug: slug,
    }

    return Object.assign({}, newComment, extraFields)
  } catch (err) {
    throw new Error('Invalid slug or default data generation ' + err.message)
  }
}

const createComment = (req, res) => {
  const type = req.contentType
  const contentId = req.query.contentId

  const comment = req.body

  commentValidations(comment)
    .then(() => {
      // Add default value to missing fields
      const newComment = fillCommentWithDefaultData(
        type,
        contentId,
        comment,
        req.currentUser
      )

      addComment(newComment)
        .then((data) => {
          // Trigger hook
          onCommentAdded(data, req.currentUser)

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
        error: 'Invalid data: ' + err,
      })
    })
}

export default async (req, res) => {
  const {
    query: {
      contentType,
      contentId,
      search,
      sortBy,
      sortOrder,
      from,
      limit,
      author,
      conversationId,
    },
  } = req

  const filterParams = {
    contentId,
    contentType,
  }

  if (conversationId) {
    filterParams.conversationId = conversationId
  } else {
    filterParams.conversationId = null
  }

  if (author) {
    filterParams.author = author
  }

  const searchParams = {
    search,
  }

  const paginationParams = {
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
    await runMiddleware(req, res, contentTypeAllowsCommentsMiddleware)
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasQueryParameters(['contentId']))
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForComment(contentType))
  } catch (e) {
    return res.status(401).json({
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

  methods(req, res, {
    get: getComments(filterParams, searchParams, paginationParams),
    post: createComment,
  })
}
