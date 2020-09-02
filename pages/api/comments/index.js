import { addComment, findComments } from '@lib/api/entities/comments'
import { commentPermission, groupCommentPermission } from '@lib/permissions'
import { isValidContentType, loadUser } from '@lib/api/middlewares'

import { commentValidations } from '@lib/validations/comment'
import config from '@lib/config'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content'
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


const getComments = async (req, res) => {
  const {
    query: {
      contentType,
      contentId,
      groupId, 
      groupType,
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
    groupId: groupId? groupId : null,
    groupType: groupType? groupType : null,
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

    // We dont' allow to retrieve comments from groups, (this could be improved with fine grained permissions checking for admins)
    filterParams.groupId = null
  } else {

    // Content is inside the group, check the group permissions
    if (groupId) {
      const group = await findOneContent(groupType, {
        id: groupId
      })
  
      if (!groupCommentPermission(req.currentUser, group.type, contentType, 'read', group)) {
        return res.status(401).json({
          error: 'User not allowed to read comments on group content',
        })
      }
    } else {
      if (!commentPermission(req.currentUser, filterParams.contentType, 'read')) {
        return res.status(401).json({
          error: 'User not allowed to read comments',
        })
      }
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
  user,
  groupId, 
  groupType
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
      groupId,
      groupType,
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

const createComment = async (req, res) => {

  const {
    contentId,
    contentType
  } = req.query

  try {
    await runMiddleware(req, res, isValidContentType(contentType))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
  }


  if (!contentId) {
    return res.status(405).json({
      error: 'Missing contentId',
    })
  }
  
  const item = await findOneContent(contentType, {
    id: contentId
  })
  
  // Check that the content exists
  if (!item) {
    return res.status(404).json({
      error: 'Content not found'
    })
  }

  // Content is inside the group, check the group permissions
  if (item.groupId) {
    const group = await findOneContent(item.groupType, {
      id: item.groupId
    })

    if (!groupCommentPermission(req.currentUser, group.type, contentType, 'create', group)) {
      return res.status(401).json({
        error: 'User not allowed to create comments on group content',
      })
    }

  } else {
    if (!req.contentType.comments.enabled) {
      return res.status(401).json({
        error: 'Comments are disabled'
      })
    }
    
    if (!commentPermission(req.currentUser, contentType, 'create')) {
      return res.status(401).json({
        error: 'User not allowed to create comments',
      })
    }
  }

  const comment = req.body

  commentValidations(comment)
    .then(() => {
      // Add default value to missing fields
      const newComment = fillCommentWithDefaultData(
        req.contentType,
        contentId,
        comment,
        req.currentUser,
        item.groupId,
        item.groupType,
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
