import { NextApiResponse } from 'next'

import { loadUser } from '@lib/api/middlewares'
import { Request, StatisticResponse } from '@lib/types'
import { connect } from '@lib/api/db'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import hasPermission from '@lib/permissions/has-permission'
import config from '@lib/config'
import { getDB } from '@lib/api/db'

const {
  statistic: { groups = [], content = [], users },
} = config

export default async (
  request: Request,
  response: NextApiResponse<{ data: StatisticResponse } | { error: string }>
) => {
  try {
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

  const { currentUser } = request

  if (!hasPermission(currentUser, ['admin.stats'])) {
    return response.status(401).json({
      error: 'Access forbidden.',
    })
  }

  await methods(request, response, {
    get: getStatistic,
  })
}

async function getStatistic(
  request: Request,
  response: NextApiResponse<StatisticResponse | { error: string }>
): Promise<void> {
  const entities: Array<{ name: string; title: string; group: string }> = [
    ...groups.map((item) => ({ ...item, group: 'groups' })),
    ...content.map((item) => ({ ...item, group: 'content' })),
  ]

  if (users.enabled) {
    entities.push({ name: 'users', title: users.title, group: 'users' })
  }

  try {
    const today = new Date()
    const yesterday = new Date(today)
    const twoDaysAgo = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const yesterdayStart = yesterday.valueOf()
    const twoDaysAgoStart = twoDaysAgo.valueOf()

    const result = await Promise.all(
      entities.map(({ name }) =>
        getDB()
          .collection(name)
          .aggregation([
            {
              $facet: {
                total: [{ $count: 'id' }],
                todayTotal: [
                  {
                    $match: {
                      createdAt: { $gte: yesterdayStart },
                    },
                  },
                  { $count: 'id' },
                ],
                yesterdayTotal: [
                  {
                    $match: {
                      createdAt: { $lte: yesterdayStart, $gte: twoDaysAgoStart },
                    },
                  },
                  { $count: 'id' },
                ],
              },
            },
          ])
          .toArray()
      )
    ).then((res) =>
      entities.reduce((acc, { group, title }, index) => {
        const [item] = res[index]

        const [{ id: total = 0 } = {}] = item?.total || []
        const [{ id: todayTotal = 0 } = {}] = item?.todayTotal || []
        const [{ id: yesterdayTotal = 0 } = {}] = item?.yesterdayTotal || []

        const value = { total, todayTotal, yesterdayTotal, title }

        if (!acc[group]) {
          acc[group] = []
        }

        acc[group].push(value)

        return acc
      }, {})
    )

    return response.json({ data: { ...result } })
  } catch (e) {
    return response.json({ error: e })
  }
}
