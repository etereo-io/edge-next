import { GroupEntityType } from '@lib/types/entities/group'
import { ContentTypeDefinition } from '@lib/types'

export type Data = { groups: GroupEntityType[]; content: ContentTypeDefinition[] }
