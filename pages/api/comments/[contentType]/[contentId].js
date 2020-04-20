import { addComment, findComments } from '../../../../lib/api/comments/comments'
import { hasPermissionsForComment, hasQueryParameters, isValidContentType } from '../../../../lib/api/middlewares'

import { commentValidations } from '../../../../lib/validations/comment'
import methods from '../../../../lib/api/api-helpers/methods'
import { onCommentAdded } from '../../../../lib/api/hooks/comment.hooks'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

// Check that the comments are allowed for this content type
function contentTypeAllowsCommentsMiddleware(req, res, cb) {
  if (!req.contentType.comments.enabled) {
    cb(new Error('Content type ' + req.contentType.slug + ' does not allow comments'))
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
        err: 'Error while loading content ' + err.message,
      })
    })
}

export function fillCommentWithDefaultData(contentType, contentId, comment, user) {
  try {

    // TODO: Parse message to extract mentions, links, images, etc
    // Best way to store mentions https://stackoverflow.com/questions/31821751/best-way-to-store-comments-with-mentions-firstname-in-database
    
    // Fill in the mandatory data like author, id, date, type
    const newComment = {
      id: uuidv4(),
      author: user.id,
      createdAt: Date.now(),
      contentType: contentType.slug,
      contentId: contentId,
      message: comment.message
    }

    const slug =  slugify(newComment.createdAt + ' ' + newComment.author)
    
    const extraFields = {
      slug: slug
    }
    
    return Object.assign({}, newComment, extraFields)
  } catch(err) {
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
      const newComment = fillCommentWithDefaultData(type, contentId, comment, req.user)

      addComment(newComment)
        .then((data) => {
          // Trigger hook
          onCommentAdded(comment, req.user)
          
          // Respond
          res.status(200).json(data)
        })
        .catch((err) => {
          res.status(500).json({
            err: 'Error while saving content ' + err.message,
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        err: 'Invalid data: ' + err,
      })
    })
}

export default async (req, res) => {
  const {
    query: { contentType, contentId, search, sortBy, sortOrder, from, limit, author },
  } = req

  const filterParams = {
    author,
    contentId,
    contentType
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
      message: e.message
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
    await runMiddleware(req, res, hasPermissionsForComment())
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getComments(filterParams, searchParams, paginationParams),
    post: createComment,
  })
}
