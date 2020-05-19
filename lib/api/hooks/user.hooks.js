import { addActivity } from '../activity/activity'
import config from '../../config'
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
