import {
  bodyParser,
  hasPermissionsForContent,
  hasQueryParameters,
  isValidContentType,
} from '../../../../lib/api/middlewares'
import {
  deleteOneContent,
  findOneContent,
  updateOneContent,
} from '../../../../lib/api/content/content'
import {
  onContentDeleted,
  onContentUpdated,
} from '../../../../lib/api/hooks/content.hooks'

import { FIELDS } from '../../../../lib/config/config-constants'
import { connect } from '../../../../lib/api/db'
import { contentValidations } from '../../../../lib/validations/content'
import { deleteFile } from '../../../../lib/api/storage'
import { findOneUser } from '../../../../lib/api/users/user'
import merge from 'deepmerge'
import methods from '../../../../lib/api/api-helpers/methods'
import runMiddleware from '../../../../lib/api/api-helpers/run-middleware'
import { uploadFiles } from '../../../../lib/api/api-helpers/dynamic-file-upload'

// disable the default body parser to be able to use file upload
export const config = {
  api: {
    bodyParser: false,
  }
}

const loadContentItemMiddleware = async (req, res, cb) => {
  const type = req.contentType

  const searchOptions = {}

  // Allow to accept ID in the api call
  // by default the API wors like /api/content/post/the-content-slug but it can accept and ID if specified
  // /api/content/post/ID?field=id
  if (req.query.field === 'id') {
    searchOptions['id'] = req.query.slug
  } else {
    searchOptions['slug'] = req.query.slug
  }

  findOneContent(type.slug, searchOptions)
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

const getContent = async (req, res) => {
  const user = await findOneUser({ id: req.item.author })

  res.status(200).json({
    ...req.item,
    user: user,
  })
}

const deleteContent = (req, res) => {
  const item = req.item

  deleteOneContent(item.type, { id: item.id })
    .then(async () => {
 
      // Trigger on content deleted hook
      await onContentDeleted(item, req.user, req.contentType)
    
      res.status(200).json({
        deleted: true
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      })
    })

}

const updateContent = async (req, res) => {

  try {
    await runMiddleware(req, res, bodyParser)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }

  const type = req.contentType

  const content = {
    ...req.body
  }

  contentValidations(type, content)
    .then(async () => {
      // Content is valid
      // Upload all the files
      const newData = await uploadFiles(type.fields, req.files, type.slug, req.item)
      const newContent = merge(content, newData)
      
      // Check if there are any missing file fields and delete them from storage
      const itemsToDelete = []
      for (const field of type.fields) {

        if (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) {
          // Go through all the items and see if in the new content there is any difference
          const previousValue = req.item[field.name] || []
          previousValue.forEach(f => {
            if (content[field.name]) {
              // Only delete if the field is set
              if (!content[field.name].find(item => item.path === f.path)) {
                itemsToDelete.push(f)
              }
            }
          })
        }
      }
      

      // Delete old items from storage
      for (let i = 0; i < itemsToDelete.length; i++) {
        try {
          await deleteFile(itemsToDelete[i].path)
        } catch(err) {
          // Error deleting file, ignore ite
        }
      }

      if (Object.keys(newContent).length === 0) {
        // It is an empty request, no file was uploaded, no file was deleted)
        res.status(200).json(req.item)
        return
      }
      
      
      updateOneContent(type.slug, req.item.id, newContent)
        .then((data) => {
          
          // Trigger on updated hook
          onContentUpdated(data, req.user)

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
    query: { type },
  } = req

  try {
    await runMiddleware(req, res, isValidContentType(type))
  } catch (e) {
    return res.status(405).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasQueryParameters(['slug']))
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
    await runMiddleware(req, res, loadContentItemMiddleware)
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent(type, req.item))
  } catch (e) {
    return res.status(401).json({
      message: e.message,
    })
  }

  methods(req, res, {
    get: getContent,
    del: deleteContent,
    put: updateContent,
    post: updateContent,
  })
}
