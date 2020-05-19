import { addActivity, deleteActivity } from '../activity/activity'
import { deleteComment, deleteOneComment, findOneComment } from '../comments/comments'
import { deleteOneContent, findOneContent } from '../content/content'

import { FIELDS } from '../../config/config-constants'
import config from '../../config'
import { deleteFile } from '../storage'
import { onCommentDeleted } from './comment.hooks'
import { onContentDeleted } from './content.hooks'
import { sendVerifyEmail } from '../../email'

export async function onUserAdded(user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_added',
      meta: {
        userId: user.id,
        username: user.username,
      },
    })
  }

  if (config.user.emailVerification) {
    await sendVerifyEmail(user.email, user.emailVerificationToken)
  }
}

export async function onUserUpdated(user, updateFields) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_updated',
      meta: {
        userId: user.id,
        username: user.username,
        fields: updateFields,
      },
    })
  }

  if (updateFields === 'email') {
    await sendVerifyEmail(user.email, user.emailVerificationToken)
  }
}

export async function onUserDeleted(user) {
  // delete user profile picture
  try {
    if (user.profile.picture) {
      await deleteFile(user.profile.picture)
    }
    
  } catch (err) {
    console.error('Error deleting profile picture', err)
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
    console.error('Error deleting files', err)
  }

  
  // delete content
  // This will be a slow and dangerous operation
  try {
    config.content.types.forEach(async (type) => {
      let content = await findOneContent(type.slug, { 
        author: user.id
      }) 

      while(content) {
        console.log('Deleting ', content.id)
        await deleteOneContent(type.slug, {
          id: content.id
        })
        
        await onContentDeleted(content, user, type)
        content = await findOneContent(type.slug, { 
          author: user.id
        }) 
      }
    })
  } catch (err) {
    console.error('Error deleting content', err)
  }

  
  // Will delete all the activities refering to this user
  await deleteActivity({
    user: user.id
  })

  // Delete all the conversations started by this user (and all children comments)
  try {
    let comment = await findOneComment({
      author: user.id,
      conversationId: null
    }) 

    while(comment) {
      console.log('Deleting comment ', comment.id)
      await deleteOneComment({
        id: comment.id
      })
      
      await onCommentDeleted(comment, user)
      comment = await findOneComment({
        author: user.id,
        conversationId: null
      })
    }

  }catch(err) {
    console.error('Error deleting extra conversations', err)
  }
  // Will remove all the comments refering to this user
  await deleteComment({
    author: user.id,
  })

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_deleted',
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
      author: user.id,
      type: 'user_logged',
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
      type: 'email_verified',
      meta: {
        userId: user.id,
        email: user.email,
      },
    })
  }
}
