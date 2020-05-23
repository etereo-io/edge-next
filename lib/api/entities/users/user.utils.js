import crypto from 'crypto'

export function hidePrivateUserFields(user) {
  if (!user) {
    return {}
  }

  const { username, profile, metadata, id } = user

  return {
    username,
    profile,
    metadata: metadata || {},
    id,
  }
}

export function userPasswordsMatch(user, password) {
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  return user.hash === hash
}

export function generateSaltAndHash(password = '') {
  const response = {}
  if (password) {
    // Users may not have an initial password because they have logged in with a social provider
    response.salt = crypto.randomBytes(16).toString('hex')
    response.hash = crypto
      .pbkdf2Sync(password, response.salt, 1000, 64, 'sha512')
      .toString('hex')
  }

  return response
}
