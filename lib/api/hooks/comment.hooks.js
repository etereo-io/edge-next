import { addActivity } from '../activity/activity'
import config from '../../config'

export function onCommentAdded(comment, user) { 

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'comment_added',
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        contentType: comment.contentType
      }
    })
  }
}

export function onCommentUpdated(comment, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'comment_updated',
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        contentType: comment.contentType
      }
    })
  }
}

export function onCommentDeleted(comment, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'comment_deleted',
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        contentType: comment.contentType
      }
    })
  }
}
