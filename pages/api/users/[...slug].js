import {
  bodyParser,
  hasPermissionsForUser,
  loadUser,
} from '@lib/api/middlewares'
import { deleteFile, uploadFile } from '@lib/api/storage'
import {
  deleteOneUser,
  findOneUser,
  updateOneUser,
} from '@lib/api/entities/users/user'
import {
  generateSaltAndHash,
  userPasswordsMatch,
} from '@lib/api/entities/users/user.utils'
import { onUserDeleted, onUserUpdated } from '@lib/api/hooks/user.hooks'

import { connect } from '@lib/api/db'
import edgeConfig from '@lib/config'
import { getSession } from '@lib/api/auth/iron'
import { hasPermission } from '@lib/permissions'
import { hidePrivateUserFields } from '@lib/api/entities/users/user.utils'
import logger from '@lib/logger'
import methods from '@lib/api/api-helpers/methods'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { uploadFiles } from '@lib/api/api-helpers/dynamic-file-upload'
import { v4 as uuidv4 } from 'uuid'

// disable the default body parser to be able to use file upload
export const config = {
  api: {
    bodyParser: false,
  },
}

const userExist = (userId = '') => async (req, res, cb) => {
  let findUserId = userId

  if (userId === 'me') {
    const session = await getSession(req)

    if (!session) {
      cb(new Error('User not found'))
      return
    }

    findUserId = session.id
  }

  const isUsername = userId.indexOf('@') === 0 ? true : false
  const findOptions = isUsername
    ? {
        username: userId.replace('@', ''),
      }
    : { id: findUserId }

  findOneUser(findOptions)
    .then((user) => {
      if (user) {
        req.item = user
        cb()
      } else {
        cb(new Error('User not found'))
      }
    })
    .catch((err) => {
      cb(new Error('User not found'))
    })
}

const getUser = (req, res) => {
  const permission = [`user.admin`]

  const showPrivateFields =
    hasPermission(req.currentUser, permission) ||
    (req.currentUser && req.currentUser.id === req.item.id)

  res
    .status(200)
    .json(showPrivateFields ? req.item : hidePrivateUserFields(req.item))
}

const delUser = (req, res) => {
  // Self deletion, check password
  if (req.currentUser.id === req.item.id) {
    if (!req.query.password) {
      res.status(400).json({ error: 'Missing password' })
      return
    }

    const passwordMatch = userPasswordsMatch(req.item, req.query.password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid password' })
      return
    }
  }

  // Other deletion, user has roles to perform operation

  deleteOneUser({
    id: req.item.id,
  })
    .then(async () => {
      await onUserDeleted(req.item)

      res.status(200).json({ done: true })
    })
    .catch((err) => {
      logger('ERROR', 'Error deleting user', err)
      res.status(500).json({ error: err.message })
    })
}

async function updateProfile(userId, profile, req) {
  const newContent = await uploadFiles(
    edgeConfig.user.profile.fields,
    req.files,
    'profile',
    req.item.profile,
    profile
  )

  return updateOneUser(userId, {
    profile: {
      ...newContent,
    },
  })
}

function updateUsername(userId, username) {
  return findOneUser({ username }).then((maybeUser) => {
    if (!maybeUser) {
      return updateOneUser(userId, { username })
    } else {
      throw new Error('Username already exists')
    }
  })
}

function updateEmail(userId, email) {
  return findOneUser({ email: email }).then((maybeUser) => {
    if (!maybeUser) {
      return updateOneUser(userId, {
        email: email,
        emailVerificationToken: uuidv4(),
      })
    } else {
      throw new Error('email already exists')
    }
  })
}

function updateBlockedStatus(userId, blocked) {
  return updateOneUser(userId, {
    blocked,
  })
}

function updatePassword(user, password, newpassword) {
  const passwordsMatch = user.hash ? userPasswordsMatch(user, password) : true
  if (passwordsMatch) {
    const { salt, hash } = generateSaltAndHash(newpassword)
    return updateOneUser(user.id, {
      salt,
      hash,
    })
  } else {
    return Promise.reject('Incorrect password')
  }
}

function updateProfilePicture(user, profilePicture) {
  return new Promise(async (resolve, reject) => {
    let path = ''

    // upload the new file
    try {
      path = await uploadFile(profilePicture, 'profilePicture')
    } catch (err) {
      reject(new Error('Error uploading file'))
      return
    }

    // Delete previous file
    if (
      user.profile.picture &&
      user.profile.picture.path &&
      user.profile.picture.source === 'internal'
    ) {
      try {
        await deleteFile(user.profile.picture.path)
      } catch (err) {
        logger('ERROR', 'Error deleting previous picture')
      }
    }

    // Asign the new path
    updateOneUser(user.id, {
      profile: {
        ...user.profile,
        picture: {
          source: 'internal',
          path: path,
          createdAt: Date.now(),
        },
      },
    })
      .then(resolve)
      .catch(reject)
  })
}

function updateProfileCover(user, profileCover) {
  return new Promise(async (resolve, reject) => {
    let path = ''

    // upload the new file
    try {
      path = await uploadFile(profileCover, 'profileCover')
    } catch (err) {
      reject(new Error('Error uploading file'))
      return
    }

    // Delete previous file
    if (
      user.profile.cover &&
      user.profile.cover.path &&
      user.profile.cover.source === 'internal'
    ) {
      try {
        await deleteFile(user.profile.cover.path)
      } catch (err) {
        logger('ERROR', 'Error deleting previous cover')
      }
    }

    // Asign the new path
    updateOneUser(user.id, {
      profile: {
        ...user.profile,
        cover: {
          source: 'internal',
          path: path,
          createdAt: Date.now(),
        },
      },
    })
      .then(resolve)
      .catch(reject)
  })
}

const updateUser = (slug) => async (req, res) => {
  try {
    await runMiddleware(req, res, bodyParser)
  } catch (e) {
    return res.status(400).json({
      error: e.message,
    })
  }

  const updateData = slug[1]

  let promiseChange = null

  switch (updateData) {
    case 'profile':
      /* Update only profile data */
      promiseChange = updateProfile(
        req.item.id,
        {
          ...req.item.profile,
          ...req.body,
        },
        req
      )
      break
    case 'username':
      /* Update only username */
      promiseChange = updateUsername(req.item.id, req.body.username)
      break
    case 'email':
      /* Update only email */
      promiseChange = updateEmail(req.item.id, req.body.email)
      break

    case 'block':
      /* Update only blocked status */
      promiseChange = updateBlockedStatus(req.item.id, req.body.blocked)
      break

    case 'password':
      /* Update only password */
      // Check that the current password req.req.body.password matches the old one
      promiseChange = updatePassword(
        req.item,
        req.body.password,
        req.body.newpassword
      )
      break

    case 'picture':
      promiseChange = updateProfilePicture(req.item, req.files.profilePicture)

      break
    case 'cover':
      promiseChange = updateProfileCover(req.item, req.files.profileCover)

      break
    default:
      promiseChange = Promise.reject('Update ' + updateData + ' not allowed')
  }

  promiseChange
    .then((newUser) => {
      // Invoke the hook
      onUserUpdated(newUser, updateData, req.currentUser)

      res.status(200).json({
        updated: true,
      })
    })
    .catch((err) => {
      logger('ERROR', err)
      res.status(400).json({
        error: err.message ? err.message : err,
      })
    })
}

export default async (req, res) => {
  const {
    query: { slug },
  } = req

  const userId = slug[0]

  try {
    // Connect to database
    await connect()
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, loadUser)
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, hasPermissionsForUser(userId))
  } catch (e) {
    return res.status(401).json({
      error: e.message,
    })
  }

  try {
    await runMiddleware(req, res, userExist(userId))
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    })
  }

  methods(req, res, {
    get: getUser,
    del: delUser,
    put: updateUser(slug),
  })
}
