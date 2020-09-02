import { InteractionTypeDefinition } from '@lib/types/interactionTypeDefinition'
import { interactionPermission } from '@lib/permissions'
import { getDB } from '@lib/api/db'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'
import { InteractionType } from '@lib/types'

type SingleResult = { agg: number }

type GetResultParams = {
  needAggregationTypes: string[]
  type: string
  values: SingleResult[] | InteractionType[]
  id: string
}

function getResult({
  needAggregationTypes,
  values,
  id,
  type,
}: GetResultParams) {
  const field = needAggregationTypes.includes(type) ? '_id' : 'entityId'
  const isArray = !needAggregationTypes.includes(type)

  if (isArray) {
    return (values as InteractionType[])
      .filter((interaction) => interaction[field] === id)
      .map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      }))
  } else {
    const result = (values as SingleResult[]).find(
      (interaction) => interaction[field] === id
    )

    return result?.agg || 0
  }
}

async function getResultInteractions(
  ids: string[],
  needAggregation: InteractionTypeDefinition[],
  dontNeedAggregation: InteractionTypeDefinition[]
) {
  const resultInteractions = []

  // do aggregation
  if (needAggregation.length) {
    const needAggregationInteractions = await Promise.all(
      needAggregation.map(({ type, aggregation }) =>
        getDB()
          .collection('interactions')
          .aggregation([
            {
              $match: {
                entityId: { $in: ids },
                type,
              },
            },
            { $group: { _id: '$entityId', agg: { [`$${aggregation}`]: 1 } } },
          ])
          .toArray()
      )
    ).then((response) =>
      needAggregation.reduce((acc, { type }, index) => {
        acc[type] = response[index]

        return acc
      }, {})
    )

    resultInteractions.push(needAggregationInteractions)
  }

  if (dontNeedAggregation.length) {
    const dontNeedAggregationInteractions = await Promise.all(
      dontNeedAggregation.map(({ type }) =>
        getDB()
          .collection('interactions')
          .aggregation([
            {
              $match: {
                entityId: { $in: ids },
                type,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'authorId',
                foreignField: '_id',
                as: 'user',
              },
            },
          ])
          .toArray()
      )
    ).then((response) =>
      dontNeedAggregation.reduce((acc, { type }, index) => {
        acc[type] = response[index]

        // $lookup returns array
        if (acc[type] && acc[type].length) {
          acc[type] = acc[type].map((item) => {
            const interactionObject = {
              ...item,
            }

            if (item.user && item.user.length) {
              const user = item.user[0]
              user.id = user._id.toString()
              interactionObject.user = hidePrivateUserFields(user)
            } else {
              delete interactionObject.user
            }

            delete interactionObject.authorId

            return interactionObject
          })
        }

        return acc
      }, {})
    )

    resultInteractions.push(dontNeedAggregationInteractions)
  }

  return resultInteractions
}

function formResult(
  data,
  userInteractions,
  resultInteractions,
  needAggregationTypes,
  permittedTypes
) {
  return data.map((record) => {
    const { id } = record

    const interactions = permittedTypes.reduce((acc, interactionType) => {
      acc[interactionType] = {
        interaction:
          userInteractions.find(
            ({ type, entityId }) => entityId === id && type === interactionType
          ) || null,
        result: null,
      }

      return acc
    }, {})

    resultInteractions.forEach((item) => {
      Object.entries<SingleResult[]>(item).forEach(([type, values]) => {
        interactions[type].result = getResult({
          needAggregationTypes,
          id,
          type,
          values,
        })
      })
    })

    return { ...record, interactions }
  })
}

type AppendInteractionsParams = {
  data: { [key: string]: any }[]
  interactionsConfig: InteractionTypeDefinition[]
  entity: 'group' | 'content' | 'user'
  currentUser
  entityType: string
}

export async function appendInteractions({
  data,
  currentUser,
  entity,
  entityType,
  interactionsConfig,
}: AppendInteractionsParams) {
  const interactionsList = interactionsConfig.map(({ type }) => type)

  const permittedTypes = interactionsList.filter((type) =>
    interactionPermission(currentUser, entity, entityType, type, 'read')
  )

  if (!permittedTypes.length) {
    return data
  }

  const ids = data.map(({ id }) => id)
  const needAggregation = interactionsConfig.filter(
    ({ type, aggregation }) => permittedTypes.includes(type) && aggregation
  )
  const needAggregationTypes = needAggregation.map(({ type }) => type)
  const dontNeedAggregation = interactionsConfig.filter(
    ({ type, aggregation }) => permittedTypes.includes(type) && !aggregation
  )

  try {
    const userInteractions = currentUser
      ? (
          await getDB()
            .collection('interactions')
            .find(
              {
                entityId: { $in: ids },
                type: { $in: permittedTypes },
                author: currentUser.id,
              },
              { limit: 1000 }
            )
        ).map((interactionItem) => {
          const { authorId, ...interaction } = interactionItem

          return interaction
        })
      : []

    const resultInteractions = await getResultInteractions(
      ids,
      needAggregation,
      dontNeedAggregation
    )

    return formResult(
      data,
      userInteractions,
      resultInteractions,
      needAggregationTypes,
      permittedTypes
    )
  } catch (e) {
    console.log(e)
  }

  return data
}
