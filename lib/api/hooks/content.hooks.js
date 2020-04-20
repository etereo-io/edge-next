import { addActivity } from '../activity/activity'
import config from '../../config'

export function onContentAdded(content, user) { 

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'content_added',
      content: content.id,
      meta: {
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type
      }
    })
  }
}

export function onContentUpdated(content, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'content_updated',
      content: content.id,
      meta: {
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type
      }
    })
  }
}

export function onContentDeleted(content, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'content_deleted',
      content: content.id,
      meta: {
        contentTitle: content.title, // This will not work with dynamic fields
        contentType: content.type
      }
    })
  }
}
