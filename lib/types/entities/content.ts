import { InteractionEntity, UserType } from '@lib/types'

export type ContentEntityType = {
  id: string
  slug: string
  type: string
  title: string
  description: string
  city?: string
  remote?: string
  tags?: Array<{ label: string; slug: string }>
  image?: Array<{ path: string; createdAt: number; name: string }>
  dateStart?: string
  timeStart?: string
  featured?: boolean
  paymentPointer?: string
  dateEnd?: string
  timeEnd?: string
  draft: boolean
  author: string
  user: UserType
  createdAt: string
  groupType: string
  groupId: string
  comments: number
  interactions: InteractionEntity[],
  visits: number
}
