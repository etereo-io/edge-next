import { addComment, findComments } from '@lib/api/entities/comments/comments'

import { commentPermission } from '@lib/permissions'
import { commentValidations } from '@lib/validations/comment'
import config from '@lib/config'
import { connect } from '@lib/api/db'
import { isValidContentType } from '@lib/api/middlewares'
import { loadUser } from '@lib/api/middlewares'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import { onCommentAdded } from '@lib/api/hooks/comment.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import slugify from 'slugify'

export const parseCommentBody = (text) => {
  const mentions = text.match(/@([A-Za-z]+[A-Za-z0-9_-]+)/g) || []
  const images =
    text.match(
      /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|jfif|webp)/g
    ) || []
  let parsedText = text

  mentions.forEach((m) => {
    parsedText = parsedText.replace(m, `[${m}](/profile/${m})`)
  })

  images.forEach((m) => {
    parsedText = parsedText.replace(m, `![${m}](${m})`)
  })

  return {
    parsedText,
    mentions: [...new Set(mentions)],
    images: [...new Set(images)],
  }
}

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

const getComments = (req, res) => {
  const {
    query: {
      contentType,
      contentId,
      sortBy,
      sortOrder,
      from,
      limit,
      author,
      conversationId,
    },
  } = req

  const filterParams = {
    contentType,
  }

  if (contentId) {
    filterParams.contentId = contentId
  }

  // If we dont specify a conversation ID we get the ones that have it to null
  if (conversationId && conversationId !== 'false') {
    filterParams.conversationId = conversationId
  } else if (conversationId === 'false') {
    // Only root comments
    filterParams.conversationId = null
  }

  if (author) {
    filterParams.author = author
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from: typeof from !== 'undefined' ? parseInt(from, 10) : from,
    limit: typeof limit !== 'undefined' ? parseInt(limit, 10) : limit,
  }

  if (!filterParams.contentType) {
    // If no content type is specified, bring in all that the user can read
    const allowedContentTypes = config.content.types
      .filter((type) => commentPermission(req.currentUser, type.slug, 'read'))
      .map((t) => t.slug)

    // If there are no allowed content types with comments that the user can read, reject
    if (allowedContentTypes.length === 0) {
      return res.status(401).json({
        error: 'User not allowed to read comments',
      })
    }

    filterParams.contentType = {
      $in: allowedContentTypes,
    }
  } else {
    // There was a specified content type check if it has permissions
    if (!commentPermission(req.currentUser, filterParams.contentType, 'read')) {
      return res.status(401).json({
        error: 'User not allowed to read comments',
      })
    }
  }

  findComments(filterParams, paginationParams)
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
    const { parsedText, mentions, images } = parseCommentBody(comment.message)

    // Best way to store mentions https://stackoverflow.com/questions/31821751/best-way-to-store-comments-with-mentions-firstname-in-database
    // Fill in the mandatory data like author, date, type
    const newComment = {
      author: user.id,
      createdAt: Date.now(),
      contentType: contentType.slug,
      contentId: contentId,
      message: parsedText,
      mentions,
      images,
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

  if (!contentId) {
    return res.status(405).json({
      error: 'Missing contentId',
    })
  }

  if (!type) {
    return res.status(400).json({
      error: 'Missing contentType',
    })
  }

  if (!commentPermission(req.currentUser, req.query.contentType, 'create')) {
    return res.status(401).json({
      error: 'User not allowed to create comments',
    })
  }

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
    query: { contentType },
  } = req

  if (contentType) {
    try {
      await runMiddleware(req, res, isValidContentType(contentType))
    } catch (e) {
      return res.status(405).json({
        error: e.message,
      })
    }

    try {
      await runMiddleware(req, res, contentTypeAllowsCommentsMiddleware)
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      })
    }
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

  methods(req, res, {
    get: getComments,
    post: createComment,
  })
}
