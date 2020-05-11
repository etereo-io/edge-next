import { addActivity } from '../activity/activity'
import config from '../../config'

export function onContentRead(content, user) {
  // TODO: We can log stats about visitors
}

export function onContentAdded(content, user) {
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      type: 'content_added',
      meta: {
        contentId: content.id,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
      },
    })
  }
}

export function onContentUpdated(content, user) {
  console.log('content updated')
  if (config.activity.enabled && content) {
    addActivity({
      author: user.id,
      type: 'content_updated',
      meta: {
        contentId: content.id,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
      },
    })
  }
}

export function onContentDeleted(content, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'content_deleted',
      meta: {
        contentId: content.id,
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type,
      },
    })

    // TODO: Delete all comments for that content
  }
}
