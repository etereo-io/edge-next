import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity/activity'

import { FIELDS } from '../../config/config-constants'
import config from '../../config'
import { deleteComment } from '@lib/api/entities/comments/comments'
import { deleteFile } from '../storage'

export function onContentRead(content, user) {
  // TODO: We can log stats about visitors
}

export function onContentAdded(content, user) {
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      role: 'user',
      type: 'content_added',
      meta: {
        contentId: content.id,
        contentSlug: content.slug,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
      },
    })
  }
}

export function onContentUpdated(content, user) {
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      role: 'user',
      type: 'content_updated',
      meta: {
        contentId: content.id,
        contentSlug: content.slug,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
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

  // Will remove all the comments refering to this content
  await deleteComment({
    contentId: content.id,
  })

  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: user.id,
      type: 'content_deleted',
      meta: {
        contentId: content.id,
        contentType: content.type,
      },
    })
  }
}
