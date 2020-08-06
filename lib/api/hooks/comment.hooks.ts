import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity/activity'
import { deleteComment } from '@lib/api/entities/comments/comments'
import { ACTIVITY_TYPES } from '@lib/constants'
import config from '@lib/config'

export function onCommentAdded(comment, user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.COMMENT_ADDED,
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
      role: 'user',
      type: ACTIVITY_TYPES.COMMENT_UPDATED,
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
    role: 'user',
    meta: {
      commentId: comment.id,
    },
  })

  // Will remove all the comments refering to this conversation
  await deleteComment({
    conversationId: comment.id,
  })

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.COMMENT_DELETED,
      meta: {
        commentId: comment.id,
        contentId: comment.contentId,
        contentType: comment.contentType,
      },
    })
  }
}
