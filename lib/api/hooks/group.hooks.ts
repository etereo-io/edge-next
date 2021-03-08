import { GroupEntityType, GroupTypeDefinition, UserType } from '@lib/types'
import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity'
import {
  deleteOneContent,
  findOneContent,
} from '@lib/api/entities/content'

import { ACTIVITY_TYPES } from '@lib/constants'
import { FIELDS } from '@lib/constants'
import config from '@lib/config'
import { deleteFile } from '@lib/api/storage'
import {
  deleteInteractions,
} from '@lib/api/entities/interactions'
import { findOneUser } from '../entities/users'
import logger from '@lib/logger'
import {
  onContentDeleted,
} from './content.hooks'
import { sendRequestToJoinToGroupEmail } from '@lib/email'

export function onGroupAdded(group:GroupEntityType, user: UserType) {
  if (config.activity.enabled && group) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_ADDED,
      meta: {
        groupId: group.id,
        groupSlug: group.seo.slug,
        groupTitle: group.title, // This will not work with dynamic fields
        groupType: group.type,
      },
    })
  }
}

export function onGroupUpdated(data: GroupEntityType, user: UserType) {
  if (config.activity.enabled && data) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_UPDATED,
      meta: {
        groupId: data.id,
        groupSlug: data.seo.slug,
        groupTitle: data.title, // This will not work with dynamic fields
        groupType: data.type,
      },
    })
  }
}

export function onGroupJoinDisapprove(data: GroupEntityType, userId: string, user: UserType) {
  if (config.activity.enabled && data) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_MEMBER_JOIN_DISAPPROVE,
      meta: {
        userId: userId,
        groupId: data.id,
        groupSlug: data.seo.slug,
        groupTitle: data.title, // This will not work with dynamic fields
        groupType: data.type,
      },
    })
  }
}

export async function onGroupJoinRequest(group: GroupEntityType, user: UserType) {

  if (config.activity.enabled && group) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_MEMBER_JOIN_REQUEST,
      meta: {
        groupId: group.id,
        groupSlug: group.seo.slug,
        groupTitle: group.title,
        groupType: group.type,
        userId: user.id,
      },
    })
  }

  const { email } = await findOneUser({ id: group.author })


  sendRequestToJoinToGroupEmail(email, group.type, group)
}

export async function onGroupDeleted(group: GroupEntityType, user: UserType, groupType: GroupTypeDefinition) {
  // Delete group files
  try {
    groupType.fields.forEach(async (field) => {
      if (
        (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) &&
        group[field.name] &&
        group[field.name].length > 0
      ) {
        group[field.name].forEach(async (file) => {
          await deleteFile(file.path)
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting files', err)
  }

  // Will delete all the activities refering to this group
  await deleteActivity({
    role: 'user',
    meta: {
      groupId: group.id,
    },
  })

  // delete all the content in the group
  // This will be a slow and dangerous operation
  try {
    config.content.types.forEach(async (type) => {
      let content = await findOneContent(type.slug, {
        gid: group.id,
      })

      while (content) {
        logger('DEBUG', 'Deleting ', content.id)
        await deleteOneContent(type.slug, {
          id: content.id,
        })

        await onContentDeleted(content, user, type)

        content = await findOneContent(type.slug, {
          gid: group.id,
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting content for group', err)
  }

   // Delete all interactions refering to this content
   await deleteInteractions({
    entity: 'group',
    entityId: group.id
  })

  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: user.id,
      type: ACTIVITY_TYPES.GROUP_DELETED,
      meta: {
        groupId: group.id,
        groupType: group.type,
      },
    })
  }
}
