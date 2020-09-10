import { EmailCreationType, EmailType } from '@lib/types/entities/email'
import {
  addEmail,
  findEmails,
} from '@lib/api/entities/email'

import { Request } from '@lib/types'
import { connect } from '@lib/api/db'
import { hasPermission } from '@lib/permissions'
import { loadUser } from '@lib/api/middlewares'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import {
  onEmailSent,
} from '@lib/api/hooks/email.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import {
  sendStandardEmail,
} from '@lib/email'

function isValidEmail(email: EmailCreationType) {
  if (!email.from || !email.to || !email.subject || !email.text) {
    return false
  }
  return true
}

function createEmail(req: Request, res) {

  const emailObject = {
    ...req.body,
    from: req.body.from || req.currentUser.email
  }

  if (!isValidEmail(emailObject)) {
    return res.status(400).json({
      error: 'Malformed email entity'
    })
  }

  sendStandardEmail(emailObject, req.currentUser)
  .then(() => {
    addEmail(emailObject)
      .then(result => {

        onEmailSent(result, req.currentUser)

        return res.status(200).json(result)
      })
  })
  .catch(err => {
    res.status(500).json({
      error: 'Error sending message ' + err.message
    })
  })
}

const getEmails = (filterParams, paginationParams) => (req: Request, res) => {
  return findEmails(filterParams, paginationParams)
    .then(result => {
      return res.status(200).json(result)
    })
}


export default async (req: Request, res) => {
  const {
    query: { search, sortBy, sortOrder, from, limit },
  } = req

  const filterParams = {}

  if (search) {
    filterParams['$or'] = [
      { to: { $regex: search } },
      { from: { $regex: search } },
      { text: { $regex: search } }
    ]
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
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

  if (!hasPermission(req.currentUser, 'admin.email'))  {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }

  await methods(req, res, {
    get: getEmails(filterParams, paginationParams),
    post: createEmail,
  })
}
