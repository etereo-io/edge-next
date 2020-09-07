import { NextApiRequest } from 'next'

import { UserType, ContentTypeDefinition, GroupEntityType, GroupTypeDefinition, ANY_OBJECT } from '@lib/types'
import { METHODS } from '@lib/api/api-helpers/methods'

export interface Request<I = GroupEntityType> extends NextApiRequest {
  currentUser?: UserType
  item?: I
  contentType?: ContentTypeDefinition
  groupType?: GroupTypeDefinition
  files?: ANY_OBJECT[]
  userId?: string
  method: METHODS
}
