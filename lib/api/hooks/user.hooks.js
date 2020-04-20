import { addActivity } from '../activity/activity'
import config from '../../config'

export function onUserAdded(user) { 

  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_added',
      content: user.id
    })
  }
}

export function onUserUpdated(user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_updated',
      content: user.id
    })
  }
}

export function onUserDeleted(user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_deleted',
      content: user.id
    })
  }
}


export function onUserLogged(user) {
  if (config.activity.enabled) {
    addActivity({
      author: user.id,
      type: 'user_logged',
      content: user.id,
      meta: {
        ip: ''
      }
    })
  }
}

