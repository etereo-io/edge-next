import { NextApiRequest, NextApiResponse } from 'next'

import { loadUser } from '@lib/api/middlewares'
import {
  ContentTypeDefinition,
  GroupEntityType,
  Request,
  UserType,
} from '@lib/types'
import { connect } from '@lib/api/db'
import { findAll, Result } from '@lib/api/entities/superSearch'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import hasPermission from '@lib/permissions/has-permission'
import config from '@lib/config'
import { ROLES } from '@lib/constants'

const {
  superSearch: { entities, enabled },
} = config

export default async (
  request: NextApiRequest,
  response: NextApiResponse<{ data: Result[] } | { error: string }>
) => {
  try {
    // Connect to database
    await connect()
  } catch (e) {
    return response.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(request, response, loadUser)
  } catch (e) {
    return response.status(500).json({
      error: e.message,
    })
  }

  const { user } = request as Request

  if (!hasPermission(user, 'superSearch.read') || !enabled) {
    return response.status(500).json({
      error: 'Access forbidden.',
    })
  }

  methods(request, response, {
    get: getEntities,
  })
}

async function getEntities(
  request: Request & { query: { query: string } },
  response: NextApiResponse<{ data: Result[] }>
): Promise<void> {
  const {
    query: { query },
    user,
  } = request

  const permittedEntities = []

  if (user) {
    // if group isn't private or user is a member of the group
  } else {
    entities
      .filter(({ permissions }) => permissions.includes(ROLES.PUBLIC))
      .forEach(({ name, fields, type }) => {
        const options = formQueryOptions(fields, query)

        permittedEntities.push({
          name,
          options,
          type,
          paginationOptions: { sortBy: 'createdAt' },
        })
      })
  }

  const data = await findAll(permittedEntities)

  return response.json({ data })
}

function formQueryOptions(
  fields: string[],
  query: string
): { $or: Array<{ [key: string]: RegExp }> } {
  return fields.reduce(
    (acc, field) => {
      if (!acc[field]) {
        acc['$or'].push({ [field]: new RegExp(query, 'gi') })
      }

      return acc
    },
    { $or: [] }
  )
}
