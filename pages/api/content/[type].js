import { addContent, findContent } from '../../../lib/api/content/content'
import { hasPermissionsForContent, isValidContentType } from '../../../lib/api/middlewares'

import { connect } from '../../../lib/api/db'
import { contentValidations } from '../../../lib/validations/content'
import methods from '../../../lib/api/api-helpers/methods'
import {onContentAdded} from '../../../lib/api/hooks/content.hooks'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'
import slugify from 'slugify'

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

    // Fill in the mandatory data like author, date, type
    const newContent = {
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
          // Trigger on content added hook
          onContentAdded(data, req.user)

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
    query: { type, search, sortBy, sortOrder, from, limit, author },
  } = req

  const filterParams = { }

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
    await runMiddleware(req, res, isValidContentType(type))
  } catch (e) {
    console.log(e)
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent(type))
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
