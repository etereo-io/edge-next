import { ACTIVITY_TYPES, FIELDS } from '@lib/constants'
import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity'

import config from '@lib/config'
import { deleteComment } from '@lib/api/entities/comments'
import { deleteFile } from '../storage'
import {
  deleteInteractions,
} from '@lib/api/entities/interactions'

export function onContentRead(content, user) {
  // TODO: We can log stats about visitors
}



export function onContentAdded(content, user) {
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.CONTENT_ADDED,
      meta: {
        contentId: content.id,
        contentSlug: content.slug,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
        groupType: content.groupType,
        groupId: content.groupId,
      },
    })
  }
}

export function onContentUpdated(content, user) {
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.CONTENT_UPDATED,
      meta: {
        contentId: content.id,
        contentSlug: content.slug,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
        groupType: content.groupType,
        groupId: content.groupId,
      },
    })
  }
}

export async function onContentDeleted(content, user, contentType) {
  // Delete content files
  try {
    contentType.fields.forEach(async (field) => {
      if (
        (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) &&
        content[field.name] &&
        content[field.name].length > 0
      ) {
        content[field.name].forEach(async (file) => {
          await deleteFile(file.path)
        })
      }
    })
  } catch (err) {
    console.error('Error deleting files', err)
  }

  // Will delete all the activities refering to this content
  await deleteActivity({
    role: 'user',
    meta: {
      contentId: content.id,
    },
  })

  // Delete all interactions refering to this content
  await deleteInteractions({
    entity: 'content',
    entityId: content.id
  })

  // Will remove all the comments refering to this content
  await deleteComment({
    contentId: content.id,
  })

  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: user.id,
      type: ACTIVITY_TYPES.CONTENT_DELETED,
      meta: {
        contentId: content.id,
        contentType: content.type,
        groupType: content.groupType,
        groupId: content.groupId,
      },
    })
  }
}
