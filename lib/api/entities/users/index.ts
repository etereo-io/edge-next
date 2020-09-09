import { generateSaltAndHash, userPasswordsMatch } from './user.utils'

import { NewUserSchema } from './user.schema'
import { UserType } from '@lib/types/entities/user'
import config from '@lib/config'
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

export async function createUser(
  {
    username,
    email,
    password,
    tokens = [],
    facebook = null,
    google = null,
    github = null,
    profile = {},
    roles = config.user.newUserRoles,
    ...otherFields
  },
  verified = false
): Promise<UserType> {
  const { salt, hash } = generateSaltAndHash(password)

  const profileFields = {}

  config.user.profile.fields.forEach((f) => {
    profileFields[f.name] = f.defaultValue || otherFields[f.name] || null
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
      emailVerified: verified || !config.user.emailVerification ? true : false,
      emailVerificationToken:
        verified || !config.user.emailVerification ? null : uuidv4(),
      roles: verified ? roles : config.user.newUserRoles,
      createdAt: Date.now(),
      profile: {
        ...otherFields,
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

export async function findUserWithPassword({
  email,
  password,
}): Promise<UserType> {
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

export async function findUsers(options, paginationOptions) {
  const { from = 0, limit = 15, sortBy, sortOrder = 'DESC' } = paginationOptions

  const total = await getDB()
    .collection('users')
    .count(options)

  return getDB()
    .collection('users')
    .limit(limit)
    .start(from)
    .find(options, {
      sortBy,
      sortOrder,
    })
    .then((data) => {
      return {
        results: data,
        from,
        limit,
        total,
      }
    })
}

export function findOneUser(options): Promise<UserType> {
  return getDB()
    .collection('users')
    .findOne(options)
}

export function updateOneUser(id, data): Promise<UserType> {
  return getDB()
    .collection('users')
    .doc(id)
    .set(data)
}

export function deleteUser(options) {
  return getDB()
    .collection('users')
    .remove(options)
}

export function deleteOneUser(options) {
  return getDB()
    .collection('users')
    .remove(options, true)
}
