import { addContent, findContent } from '@lib/api/entities/content'
import {
  hasPermissionsForGroup,
  isValidGroupType,
  loadUser,
} from '@lib/api/middlewares'
import { groupPermission } from '@lib/permissions'
import { ANY_OBJECT, Request } from '@lib/types'
import { connect } from '@lib/api/db'
import { fillContentWithDefaultData } from '@lib/api/entities/content/content.utils'
import { groupValidations } from '@lib/validations/group'
import methods from '@lib/api/api-helpers/methods'
import { onGroupAdded } from '@lib/api/hooks/group.hooks'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import {
  cypherData,
  getDecipheredData,
} from '@lib/api/api-helpers/cypher-fields'

const getGroups = (filterParams, paginationParams, member) => async (
  req: Request,
  res
) => {
  const type = req.groupType

  const increasedFilters = {
    ...filterParams,
  }

  if (member) {
    // Filter by member
    increasedFilters.members = { $elemMatch: { id: member } }
  }

  const isAdmin =
    req.currentUser && req.currentUser.roles.indexOf('ADMIN') !== -1

  const isOwner =
    req.currentUser &&
    filterParams.author &&
    req.currentUser.id === filterParams.author

  if (type.publishing.draftMode && !isAdmin && !isOwner) {
    // Filter by draft, except for admins and owners
    increasedFilters.draft = false
  }

  return findContent(type.slug, increasedFilters, paginationParams)
    .then(async (data) => {
      if (data.total) {
        const results = await appendInteractions({
          data: data.results,
          interactionsConfig: type.entityInteractions,
          entity: 'group',
          entityType: type.slug,
          currentUser: req.currentUser,
        })

        const decipheredData = getDecipheredData(
          {
            type: type.slug,
            entity: 'group',
            fields: type.fields,
          },
          results,
          req.currentUser
        )

        const content = decipheredData.map((group) => {
          if (
            !groupPermission(req.currentUser, type.slug, 'user.read', group)
          ) {
            const { members, pendingMembers, ...item } = group

            const permittedUsers = (members || []).filter(
              ({ id }) => id === req?.currentUser?.id
            )

            const permittedPendingUsers = (pendingMembers || []).filter(
              ({ id }) => id === req?.currentUser?.id
            )

            return {
              ...item,
              members: permittedUsers,
              pendingMembers: permittedPendingUsers,
            }
          }

          return group
        })

        return res.status(200).json({ ...data, results: content })
      }

      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error while loading content ' + err.message,
      })
    })
}

const createGroup = async (req: Request, res) => {
  const type = req.groupType
  const content = req.body

  return groupValidations(type, content)
    .then(async () => {
      // Content is valid
      // Add default value to missing fields
      const newContent = fillContentWithDefaultData(
        type,
        {
          ...content,
          members: [
            {
              id: req.currentUser.id,
              roles: ['GROUP_ADMIN'],
            },
            ...(content.members
              ? content.members.map((member) => ({
                  id: member.id,
                  roles: member.roles,
                }))
              : []),
          ],
        },
        req.currentUser
      )

      const cypheredData = cypherData(type.fields, newContent)

      addContent(type.slug, cypheredData)
        .then((data) => {
          // Trigger on content added hook
          onGroupAdded(data, req.currentUser)

          const [group] = getDecipheredData(
            {
              type: type.slug,
              entity: 'group',
              fields: type.fields,
            },
            [data],
            req.currentUser
          )

          // Respond
          res.status(200).json(group)
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error while saving group ' + err.message,
          })
        })
    })
    .catch((err) => {
      res.status(400).json({
        error: 'Invalid data: ' + err.message,
      })
    })
}

export default async (req: Request, res) => {
  const {
    query: { type, sortBy, sortOrder, from, limit, author, member },
  } = req

  const filterParams: ANY_OBJECT = {}

  if (author) {
    filterParams.author = author
  }

  const paginationParams = {
    sortBy,
    sortOrder,
    from,
    limit,
  }

  try {
    await runMiddleware(req, res, isValidGroupType(type))
  } catch (e) {
    return res.status(405).json({
      error: e.message,
    })
  }

  try {
    // Connect to database
    await connect()
  } catch (e) {
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

  try {
    await runMiddleware(req, res, hasPermissionsForGroup(type))
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  await methods(req, res, {
    get: getGroups(filterParams, paginationParams, member),
    post: createGroup,
  })
}
