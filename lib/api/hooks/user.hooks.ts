import { ACTIVITY_TYPES, FIELDS } from '@lib/constants'
import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity'
import {
  deleteComment,
  deleteOneComment,
  findOneComment,
} from '@lib/api/entities/comments'
import {
  deleteOneContent,
  findOneContent,
} from '@lib/api/entities/content'

import config from '@lib/config'
import { deleteFile } from '../storage'
import logger from '@lib/logger'
import { onCommentDeleted } from './comment.hooks'
import { onContentDeleted } from './content.hooks'
import { sendVerifyEmail } from '@lib/email'

export async function onUserAdded(user, currentUser) {
  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: currentUser ? currentUser.id : user.id,
      // If is currentUser  it means the user has been created in the administration
      type: currentUser ? ACTIVITY_TYPES.USER_ADDED_MANUALLY : ACTIVITY_TYPES.USER_ADDED,
      meta: {
        userId: user.id,
        username: user.username,
      },
    })
  }

  if (config.user.emailVerification && !currentUser) {
    await sendVerifyEmail(user.email, user.emailVerificationToken)
    addActivity({
      role: 'system',
      author: user.id,
      type: ACTIVITY_TYPES.EMAIL_SENT,
      meta: {
        userId: user.id,
        username: user.username,
        info: 'Verify email from user creation',
      },
    })
  }
}


export async function onUserUpdated(user, updateFields, currentUser) {
  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: currentUser.id,
      type: ACTIVITY_TYPES.USER_UPDATED,
      meta: {
        userId: user.id,
        username: user.username,
        fields: updateFields,
      },
    })
  }

  if (updateFields === 'email') {
    await sendVerifyEmail(user.email, user.emailVerificationToken)
    addActivity({
      role: 'system',
      author: user.id,
      type: ACTIVITY_TYPES.EMAIL_SENT,
      meta: {
        userId: user.id,
        username: user.username,
        info: 'Verify email from user edition',
      },
    })
  }
}

export async function onUserDeleted(user) {
  // delete user profile picture
  try {
    if (user.profile.picture && user.profile.picture.source === 'internal') {
      await deleteFile(user.profile.picture.path)
    }
  } catch (err) {
    logger('ERROR', 'Error deleting profile picture', err)
  }

  // Delete user files
  try {
    config.user.profile.fields.forEach(async (field) => {
      if (
        (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) &&
        user.profile[field.name] &&
        user.profile[field.name].length > 0
      ) {
        user.profile[field.name].forEach(async (file) => {
          await deleteFile(file.path)
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting files', err)
  }

  // delete content
  // This will be a slow and dangerous operation
  try {
    config.content.types.forEach(async (type) => {
      let content = await findOneContent(type.slug, {
        author: user.id,
      })

      while (content) {
        logger('DEBUG', 'Deleting ', content.id)
        await deleteOneContent(type.slug, {
          id: content.id,
        })

        await onContentDeleted(content, user, type)
        content = await findOneContent(type.slug, {
          author: user.id,
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting content', err)
  }

  // Will delete all the activities refering to this user
  await deleteActivity({
    author: user.id,
    role: 'user',
  })

  // Delete all the conversations started by this user (and all children comments)
  try {
    let comment = await findOneComment({
      author: user.id,
      conversationId: null,
    })

    while (comment) {
      await deleteOneComment({
        id: comment.id,
      })

      await onCommentDeleted(comment, user)
      comment = await findOneComment({
        author: user.id,
        conversationId: null,
      })
    }
  } catch (err) {
    logger('ERROR', 'Error deleting extra conversations', err)
  }
  // Will remove all the comments refering to this user
  await deleteComment({
    author: user.id,
  })

  if (config.activity.enabled) {
    addActivity({
      role: 'system',
      type: ACTIVITY_TYPES.USER_DELETED,
      author: user.id,
      meta: {
        userId: user.id,
        username: user.username,
      },
    })
  }
}

export async function onUserLogged(user) {
  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: user.id,
      type: ACTIVITY_TYPES.USER_LOGGED,
      meta: {
        userId: user.id,
        username: user.username,
      },
    })
  }
}

export async function onEmailVerified(user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      role: 'system',
      type: ACTIVITY_TYPES.EMAIL_VERIFIED,
      meta: {
        userId: user.id,
        email: user.email,
      },
    })
  }
}
