import { findOneUser } from '../users/user'
import { getDB } from '../../db'
import { hidePrivateUserFields } from '../users/user.utils'
import slugify from 'slugify'

export function findOneContent(type, options) {
  return getDB()
    .collection(type)
    .findOne(options)
    .then(async (result) => {
      if (result) {
        const user = await findOneUser({ id: result.author })
        return {
          ...result,
          user: hidePrivateUserFields(user),
        }
      } else {
        return result
      }
    })
}


export function fillContentWithDefaultData(contentType, content, user) {
  try {
    const defaultEmptyFields = {}

    contentType.fields.forEach((f) => {
      defaultEmptyFields[f.name] = f.defaultValue || null
    })

    // Fill in the mandatory data like author, date, type
    const newContent = {
      author: user.id,
      createdAt: Date.now(),
      type: contentType.slug,
      ...defaultEmptyFields,
      ...content,
    }

    const slug = slugify(
      contentType.slugGeneration.reduce(
        (prev, next) =>
          prev + ' ' + (next !== 'userId' ? newContent[next] : user.id),
        ''
      ),
      {
        lower: true,
        strict: true,
      }
    )

    const extraFields = {
      slug: slug,
    }

    return Object.assign({}, newContent, extraFields)
  } catch (err) {
    throw new Error('Invalid slug or default data generation ' + err.message)
  }
}


export function addContent(type, data) {

  return getDB().collection(type).add(data)
}

export function updateOneContent(type, id, data) {
  return getDB().collection(type).doc(id).set(data)
}

export async function findContent(
  type,
  options = {},
  searchOptions = {},
  paginationOptions = {}
) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
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
      const commentsCount = await Promise.all(
        data.map((d) =>
          getDB().collection('comment').count({ contentId: d.id })
        )
      )

      const users = await Promise.all(
        data.map((d) => findOneUser({ id: d.author }))
      )

      return {
        results: data.map((d, index) => {
          return {
            ...d,
            comments: commentsCount[index],
            user: hidePrivateUserFields(users[index]),
          }
        }),
        from,
        limit,
      }
    })
}

export function deleteContent(type, options) {
  return getDB().collection(type).remove(options)
}

export function deleteOneContent(type, options) {
  return getDB().collection(type).remove(options, true)
}
