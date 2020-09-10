import { GroupEntityType } from '@lib/types/entities/group'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import { UserType } from '@lib/types'

export type SuperSearchResponse = {
  data: Partial<GroupEntityType>[] | Partial<ContentTypeDefinition>[] | Partial<UserType>[]
  type: 'user' | 'group' | 'content'
  name: string
}
