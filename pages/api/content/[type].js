import methods from '../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'
import { findContent, addContent } from '../../../lib/api/content/content'
import { contentValidations } from '../../../lib/validations/content'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { isValidContentType, hasPermissionsForContent } from '../../../lib/api/middlewares'

const getContent = (filterParams, searchParams, paginationParams) => (
  req,
  res
) => {
  const type = req.contentType

  findContent(type.slug, filterParams, searchParams, paginationParams)
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
    const newContent = {
      id: uuidv4(),
      author: user.id,
      createdAt: Date.now(),
      type: contentType.slug,
      ...defaultEmptyFields,
      ...content
    }

    const slug =  slugify(contentType.slugGeneration.reduce((prev, next) => prev + ' ' + newContent[next], ''))
    
    const extraFields = {
      slug: slug
    }
    
    return Object.assign({}, newContent, extraFields)
  } catch(err) {
    throw new Error('Invalid slug or default data generation ' + err.message)
  }

}

const createContent = (req, res) => {
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
    query: { type, search, sortBy, sortOrder, from, limit, author },
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
    from,
    limit,
  }
  
  try {
    await runMiddleware(req, res, isValidContentType(type))
  } catch (e) {
    console.log(e)
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent())
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getContent(filterParams, searchParams, paginationParams),
    post: createContent,
  })
}
