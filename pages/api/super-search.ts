import { NextApiRequest, NextApiResponse } from 'next'

import { loadUser } from '@lib/api/middlewares'
import { Request, SuperSearchResponse } from '@lib/types'
import { connect } from '@lib/api/db'
import { findAll } from '@lib/api/entities/superSearch'
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
  response: NextApiResponse<{ data: SuperSearchResponse[] } | { error: string }>
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

  const { currentUser } = request as Request

  if (
    !hasPermission(currentUser, ['superSearch.read', 'user.admin']) ||
    !enabled
  ) {
    return response.status(401).json({
      error: 'Access forbidden.',
    })
  }

  methods(request, response, {
    get: getEntities,
  })
}

async function getEntities(
  request: Request & { query: { query: string } },
  response: NextApiResponse<{ data: SuperSearchResponse[] }>
): Promise<void> {
  const {
    query: { query },
    currentUser,
  } = request

  if (!query) {
    return response.json({ data: [] })
  }

  const filteredEntities = []

  if (currentUser) {
    const { roles: userRoles } = currentUser
    // TODO: maybe it can be done in the better way
    filteredEntities.push(
      ...entities.reduce((acc, entity) => {
        const { permissions: roles, type } = entity

        const canSee = roles.some(
          (role) =>
            userRoles.includes(role) ||
            role === ROLES.PUBLIC ||
            userRoles.includes(ROLES.ADMIN)
        )

        if (canSee) {
          acc.push(entity)
        } else {
          // if a user is already in the group then the user can see that group
          if (type === 'group') {
            acc.push({
              ...entity,
              extraAndOptions: {
                members: { $elemMatch: { id: currentUser.id } },
              },
            })
          }
        }

        return acc
      }, [])
    )
  } else {
    filteredEntities.push(
      ...entities.filter(({ permissions }) =>
        permissions.includes(ROLES.PUBLIC)
      )
    )
  }

  const permittedEntities = filteredEntities.map(
    ({ name, fields, type, extraAndOptions }) => {
      let options = formQueryOptions(fields, query)

      if (extraAndOptions) {
        options = { ...extraAndOptions, ...options }
      }

      return {
        name,
        options,
        type,
      }
    }
  )

  const data = await findAll(permittedEntities)

  return response.json({ data })
}

function formQueryOptions(
  fields: string[],
  query: string
): { $or: Array<{ [key: string]: RegExp | object }> } {
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
