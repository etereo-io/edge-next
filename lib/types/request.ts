import { NextApiRequest } from 'next'

import { UserType } from '@lib/types'
import { GroupEntityType } from '@lib/types/entities/group'

export interface Request extends NextApiRequest {
  currentUser?: UserType
  item?: GroupEntityType
}
