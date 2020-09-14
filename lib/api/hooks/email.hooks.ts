import { ACTIVITY_TYPES } from '@lib/constants'
import { EmailType } from '@lib/types/entities/email'
import { UserType } from '@lib/types/entities/user'
import {
  addActivity,
} from '@lib/api/entities/activity'
import config from '@lib/config'

export function onEmailSent(email: EmailType, userSender? : UserType) {
  if (config.activity.enabled && userSender) {
    addActivity({
      author: userSender.id,
      role: 'user',
      type: ACTIVITY_TYPES.EMAIL_SENT,
      meta: {
        emailId: email.id
      },
    })
  }
}
