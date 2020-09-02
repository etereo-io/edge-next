import { findOneUser } from '@lib/api/entities/users'
import { getDB } from '@lib/api/db'
import { ANY_OBJECT } from '@lib/types'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'

export function findOneContent(type, options) {
  console.log('find', type, options)
  return getDB()
    .collection(type)
    .findOne(options)
    .then(async (result) => {
      if (result) {
        return fillContent(result)
      } else {
        return result
      }
    })
}

export function addContent(type, data) {

  return getDB().collection(type).add(data)
    .then(result => {
      return fillContent(result)
    })
}

export function updateOneContent(type, id, data) {
  return getDB().collection(type).doc(id).set(data)
  .then(result => {
    return fillContent(result)
  })
}


// Fill content to be read with data from other collections
export async function fillContent(item) {
  const comments = await getDB().collection('comment').count({ contentId: item.id })
  const user = await findOneUser({ id: item.author })
  const members = item.members && item.members.length > 0 ? await Promise.all(item.members.map(member => findOneUser({id: member.id}).then(hidePrivateUserFields).then(user => ({
    ...user,
    roles: member.roles
  })))) : null

  return {
    ...item,
    user : hidePrivateUserFields(user),
    comments,
    members
  }

}

export async function findContent(
  type,
  options = {},
  paginationOptions: ANY_OBJECT = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB().collection(type).count(options);

  return getDB()
    .collection(type)
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder,
    })
    .then(async (data) => {
      // Fill the content with the comments information
      const results = await Promise.all(
        data.map((d) =>
          fillContent(d)
        )
      )

      return {
        results,
        from,
        limit,
        total
      }
    })
}

export function deleteContent(type, options) {
  return getDB().collection(type).remove(options)
}

export function deleteOneContent(type, options) {
  return getDB().collection(type).remove(options, true)
}
