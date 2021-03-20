import { NextApiResponse } from 'next'
import { Request } from '@lib/types'
import { connect } from '@lib/api/db'
import { getDB } from '@lib/api/db'
import hasPermission from '@lib/permissions/has-permission'
import { loadUser } from '@lib/api/middlewares'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

type MaintenanceResponse = {
  enabled: boolean
}

export default async (
  request: Request,
  response: NextApiResponse<{ data: MaintenanceResponse } | { error: string }>
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

 
  await methods(request, response, {
    get: async (request: Request, response: NextApiResponse) => {
      const item = await getMaintenanceMode()
      response.status(200).json({
        enabled: item.value
      })
    },
    // Update the maintenance mode
    put: async (request: Request, response: NextApiResponse) => {
      const { currentUser } = request

      if (!hasPermission(currentUser, ['admin.access'])) {
        return response.status(401).json({
          error: 'Access forbidden.',
        })
      }

      
      const db = getDB()

      const previousConfig = await db.collection('config').findOne({
        config: 'maintenance'
      })

      const newValue = !!request.body.enabled

      if (!previousConfig) {
        await db.collection('config').add({
          ...defaultConfiguration,
          value: newValue
        })
      } else {
        await db.collection('config').doc(previousConfig.id).set({
          value: newValue
        })
      }

      response.status(200).json({
        enabled: newValue
      })
    },

  })
}

const defaultConfiguration = {
  config: 'maintenance',
  value: false
}

export async function getMaintenanceMode() {
  const db = getDB()

  const previousConfig = await db.collection('config').findOne({
    config: 'maintenance'
  }) || defaultConfiguration

  return previousConfig
}


