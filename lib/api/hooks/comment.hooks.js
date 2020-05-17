import { addActivity, deleteActivity } from '../activity/activity'

import config from '../../config'
import { deleteComment } from '../comments/comments'

export function onCommentAdded(comment, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'comment_added',
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        commentSlug: comment.slug,
        contentType: comment.contentType,
      },
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
        commentSlug: comment.slug,
        contentType: comment.contentType,
      },
    })
  }
}
 
export async function onCommentDeleted(comment, user) {
  // Will delete all the activities refering to this content
  await deleteActivity({
    meta: {
      commentId: comment.id
    }
  })

  // Will remove all the comments refering to this conversation
  await deleteComment({
    conversationId: comment.id
  })

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'comment_deleted',
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        contentType: comment.contentType,
      },
    })
  }

}
