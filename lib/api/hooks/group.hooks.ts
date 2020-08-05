import {
  addActivity,
  deleteActivity,
} from '@lib/api/entities/activity/activity'
import {
  deleteOneContent,
  findOneContent,
} from '@lib/api/entities/content/content'
import { ACTIVITY_TYPES } from '@lib/constants'
import { FIELDS } from '@lib/config/config-constants'
import config from '@lib/config'
import { deleteFile } from '@lib/api/storage'
import logger from '@lib/logger'

export function onGroupAdded(group, user) {
  if (config.activity.enabled && group) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_ADDED,
      meta: {
        groupId: group.id,
        groupSlug: group.slug,
        groupTitle: group.title, // This will not work with dynamic fields
        groupType: group.type,
      },
    })
  }
}

export function onGroupUpdated(group, user) {
  if (config.activity.enabled && group) {
    addActivity({
      author: user.id,
      role: 'user',
      type: ACTIVITY_TYPES.GROUP_UPDATED,
      meta: {
        groupId: group.id,
        groupSlug: group.slug,
        groupTitle: group.title, // This will not work with dynamic fields
        groupType: group.type,
      },
    })
  }
}

export async function onGroupDeleted(group, user, groupType) {
  // Delete group files
  try {
    groupType.fields.forEach(async (field) => {
      if (
        (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) &&
        group[field.name] &&
        group[field.name].length > 0
      ) {
        group[field.name].forEach(async (file) => {
          await deleteFile(file.path)
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting files', err)
  }

  // Will delete all the activities refering to this group
  await deleteActivity({
    role: 'user',
    meta: {
      groupId: group.id,
    },
  })

  // delete all the content in the group
  // This will be a slow and dangerous operation
  try {
    config.content.types.forEach(async (type) => {
      let content = await findOneContent(type.slug, {
        gid: group.id,
      })

      while (content) {
        logger('DEBUG', 'Deleting ', content.id)
        await deleteOneContent(type.slug, {
          id: content.id,
        })

        // TODO: we dont have such hook for now
        // await onContentDeleted(content, user, type)
        content = await findOneContent(type.slug, {
          gid: group.id,
        })
      }
    })
  } catch (err) {
    logger('ERROR', 'Error deleting content for group', err)
  }

  if (config.activity.enabled) {
    addActivity({
      role: 'user',
      author: user.id,
      type: ACTIVITY_TYPES.GROUP_DELETED,
      meta: {
        groupId: group.id,
        groupType: group.type,
      },
    })
  }
}
