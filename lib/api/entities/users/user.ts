import { generateSaltAndHash, userPasswordsMatch } from './user.utils'

import { NewUserSchema } from './user.schema'
import { UserType } from '../../../types/user'
import config from '../../../config'
import { getDB } from '../../db'
import { v4 as uuidv4 } from 'uuid'

export function validateNewUser(user) {
  try {
    return NewUserSchema.validateSync(user, {
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

export async function createUser({
  username,
  email,
  password,
  tokens = [],
  facebook = null,
  google = null,
  github = null,
  profile = {},
}): Promise<UserType> {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const { salt, hash } = generateSaltAndHash(password)

  const profileFields = {}

  config.user.profile.fields.forEach((f) => {
    profileFields[f.name] = f.defaultValue || null
  })

  return getDB()
    .collection('users')
    .add({
      username,
      salt,
      hash,
      email,
      facebook,
      google,
      github,
      emailVerified: config.user.emailVerification ? false : true,
      emailVerificationToken: config.user.emailVerification ? uuidv4() : null,
      roles: config.user.roles, // New user roles
      createdAt: Date.now(),
      profile: {
        ...profileFields,
        ...profile,
      },
      tokens, // Used to store oauth tokens
      metadata: {
        reported: 0,
        lastLogin: null,
      },
    })
}

export async function findUserWithPassword({ email, password }) : Promise<UserType>{
  // Here you should lookup for the user in your DB and compare the password:
  const user = await findOneUser({
    email,
  })

  if (!user) {
    return Promise.reject('User not found')
  } else {
    if (user && !user.hash) {
      return Promise.reject(
        'You have registered using a sign-in provider. To enable password login, login using a provider, and then set a password under your user profile.'
      )
    }

    // todo: Check password salt/hash
    return userPasswordsMatch(user, password)
      ? user
      : Promise.reject('Passwords does not match')
  }
}

export function findUsers(options, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions
  return getDB()
    .collection('users')
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder
    })
    .then((data) => {
      return {
        results: data,
        from,
        limit,
      }
    })
}

export function findOneUser(options): Promise<UserType> {
  return getDB().collection('users').findOne(options)
}

export function updateOneUser(id, data): Promise<UserType> {
  return getDB().collection('users').doc(id).set(data)
}

export function deleteUser(options) {
  return getDB().collection('users').remove(options)
}

export function deleteOneUser(options) {
  return getDB().collection('users').remove(options, true)
}
