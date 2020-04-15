import methods from '../../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import { findComments, addComment } from '../../../../lib/api/comments/comments'
import { commentValidations } from '../../../../lib/validations/comment'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { isValidContentType, hasQueryParameters, hasPermissionsForComment } from '../../../../lib/api/middlewares'

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
    query: { contentType, contentId, search, sortBy, sortOrder, page, pageSize, author },
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
    page,
    pageSize,
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
