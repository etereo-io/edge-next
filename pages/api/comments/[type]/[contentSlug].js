import methods from '../../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import { findComments, addComment } from '../../../../lib/api/comments/comments'
import { commentsValidations } from '../../../../lib/validations/comment'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { isValidContentType, hasPermissionsForComment } from '../../../../lib/api/middlewares'

const getComments = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  const type = req.contentType

  findComments(type.slug, filterParams, searchParams, paginationParams)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        err: 'Error while loading content ' + err.message,
      })
    })
}


export function fillContentWithDefaultData(contentType, content, user) {
  try {
    const defaultEmptyFields = {}

    contentType.fields.forEach(f => {
      defaultEmptyFields[f.name] = f.defaultValue || null
    })

    // Fill in the mandatory data like author, id, date, type
    const newComment = {
      id: uuidv4(),
      author: user.id,
      createdAt: Date.now(),
      type: contentType.slug,
      ...defaultEmptyFields,
      ...content
    }

    const slug =  slugify(contentType.slugGeneration.reduce((prev, next) => prev + ' ' + newComment[next], ''))
    
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

  const content = req.body
  
  contentValidations(type, content)
    .then(() => {
      // Content is valid

      // Add default value to missing fields
      const newContent = fillContentWithDefaultData(type, content, req.user)

      addContent(type.slug, newContent)
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
    query: { type, search, sortBy, sortOrder, page, pageSize, author },
  } = req

  const filterParams = {
    author,
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
    await runMiddleware(req, res, isValidContentType(req.query.type))
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasQueryParameters(['contentSlug']))
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
