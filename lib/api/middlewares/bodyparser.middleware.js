// This middleware parses content types form data

import config from '../../config'
import formidable from 'formidable'
import getRawBody from 'raw-body'
import logger from '@lib/logger'
import { parse } from 'content-type'

function parseJson(str) {
  if (str.length === 0) {
    // special-case empty json body, as it's a common client-side mistake
    return {}
  }

  try {
    return JSON.parse(str)
  } catch (e) {
    throw new Error('Invalid JSON')
  }
}

export async function parseBody(req, limit, parameters) {
  let buffer
  const encoding = parameters.charset || 'utf-8'
  try {
    buffer = await getRawBody(req, { encoding, limit })
  } catch (e) {
    console.log(e)
    if (e.type === 'entity.too.large') {
      throw new Error(`Body exceeded ${limit} limit`)
    } else {
      logger('ERROR', e)
      throw new Error('Invalid body')
    }
  }
  
  const body = buffer.toString()
  
  return parseJson(body)
}

export async function bodyParser(req, res, cb) {

  const contentType = parse(req.headers['content-type'] || 'text/plain')
  const { type, parameters } = contentType


  if (type === 'application/json' || type === 'application/ld+json') {
    try {
      req.body = await parseBody(
        req,
        config.api && config.api.bodyParser && config.api.bodyParser.sizeLimit
          ? config.api.bodyParser.sizeLimit
          : '1mb',
        parameters
      )
      cb()
    } catch (e) {
      cb(e)
    }
  } else {
    // TOTO: I think we need to change this lib to multer or smth because some files become broken after parsing
    const form = formidable({ multiples: true })

    form.parse(req, (err, fields, files) => {
      if (err) {
        cb(err)
        return
      }

      req.body =  { ...fields }
      req.files = files
      cb()
    })
  }
}
