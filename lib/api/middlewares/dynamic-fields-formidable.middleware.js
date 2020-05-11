// This middleware parses content types form data

import config from '../../config'
import formidable from 'formidable'
import getRawBody from 'raw-body'
import { parse } from 'content-type'

function parseJson(str) {
  if (str.length === 0) {
    // special-case empty json body, as it's a common client-side mistake
    return {}
  }

  try {
    return JSON.parse(str)
  } catch (e) {
    throw new ApiError(400, 'Invalid JSON')
  }
}


export async function parseBody(req, limit, parameters) {
  let buffer
  const encoding = parameters.charset || 'utf-8'
  try {
    buffer = await getRawBody(req, { encoding, limit })
  } catch (e) {
    if (e.type === 'entity.too.large') {
      throw new Error(`Body exceeded ${limit} limit`)
    } else {
      console.log(e)
      throw new Error('Invalid body')
    }
  }

  const body = buffer.toString()
  return parseJson(body)
}

export default (cb) => async (req, res) => {
  const contentType = parse(req.headers['content-type'] || 'text/plain')
  const { type, parameters } = contentType
  console.log(req.headers, type, parameters)

  if (type === 'application/json' || type === 'application/ld+json') {
    try {

      req.body = await parseBody(
        req,
        config.api && config.api.bodyParser && config.api.bodyParser.sizeLimit
          ? config.api.bodyParser.sizeLimit
          : '1mb',
        parameters
      )
      cb(req, res)
    } catch (e) {
      res.status(500).json({
        error: e.message
      })
    }

  } else {
    const form = formidable({ multiples: true });
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({error: err.message})
        return
      }
  
      const newFields = {...fields}
  
      console.log(newFields, req.body)
      
      req.body = newFields
      req.files = files
      cb(req, res)
    });
    
  }
}