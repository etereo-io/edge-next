import { ANY_OBJECT, ContentTypeDefinition, GroupEntityType, GroupTypeDefinition, UserType } from '@lib/types'

import { METHODS } from '@lib/api/api-helpers/methods'
import { NextApiRequest } from 'next'

export interface Request<I = GroupEntityType> extends NextApiRequest {
  currentUser?: UserType
  item?: I
  contentType?: ContentTypeDefinition
  groupType?: GroupTypeDefinition
  files?: ANY_OBJECT[]
  userId?: string
  method: METHODS,
  query:any
}
