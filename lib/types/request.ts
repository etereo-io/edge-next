import { NextApiRequest } from 'next'

import { UserType } from '@lib/types/user'
import { GroupEntityType } from '@lib/types/entities/group'

export interface Request extends NextApiRequest {
  user?: UserType
  item?: GroupEntityType
}
