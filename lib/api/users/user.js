import { getDB } from '../db'
// import crypto from 'crypto'
import userSchema from './user.schema'
/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

export function validateUser(user) {
  try {
    return userSchema
    .validateSync(user, {
      abortEarly: false,
    })
  } catch (e) {
    if (e.name === 'ValidationError') {
      throw new Error('Invalid user: ' + e.errors.join(', '))
    } else {
      throw e
    }
  }

}

export async function createUser({ username, email, password }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  //
  // const salt = crypto.randomBytes(16).toString('hex')
  // const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  // const user = await getDB().createUser({ username, salt, hash })

  return getDB()
    .collection('users')
    .add({
      username,
      email,
      password,
      roles: ['USER'],
      createdAt: Date.now(),
      id: Date.now(),
    })
}

export async function findUser({ email, password }) {
  // Here you should lookup for the user in your DB and compare the password:  
  const user = await findOneUser({
    email
  })

  if (!user) {
    return Promise.reject('User not found')
  } else {
    // const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
    // const passwordsMatch = user.hash === hash
    // todo: Check password salt/hash
    return user
  }
  
}

export function findUsers(options, searchOptions, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
  return getDB()
    .collection('users')
    .limit(limit)
    .start(from)
    .find(options)
    .then((data) => {
      return {
        results: data,
        from,
        limit,
      }
    })
}

export function findOneUser(options) {
  return getDB().collection('users').findOne(options)
}

export function updateOneUser(id, data) {
  return getDB().collection(type).doc(id).set(data)
}
