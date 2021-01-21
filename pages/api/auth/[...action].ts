import {
  facebookStrategy,
  githubStrategy,
  googleStrategy,
  localStrategy,
} from '@lib/api/auth/passport-strategies'
import { findOneUser, updateOneUser } from '@lib/api/entities/users'
import { onEmailVerified, onUserLogged } from '@lib/api/hooks/user.hooks'
import { removeTokenCookie, setTokenCookie } from '@lib/api/auth/auth-cookies'

import { Request } from 'express'
import { UserType } from '@lib/types'
import appConfig from '@lib/config'
import { connect } from '@lib/api/db'
import { encryptSession } from '@lib/api/auth/token'
import express from 'express'
import { generateSaltAndHash } from '@lib/api/entities/users/user.utils'
import logger from '@lib/logger'
import passport from 'passport'
import { sendResetPassworEmail } from '@lib/email'
import { v4 as uuidv4 } from 'uuid'

export const config = {
  api: {
    externalResolver: true, // https://github.com/vercel/next.js/issues/10439#issuecomment-633013628
  },
}

const app = express()
const authenticate = (method, req: Request, res): Promise<UserType> =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

app.disable('x-powered-by')

app.use(passport.initialize())

passport.use(localStrategy())

// Configure the different providers
if (appConfig.user.providers.facebook) {
  passport.use(facebookStrategy())
}

if (appConfig.user.providers.google) {
  passport.use(googleStrategy())
}

if (appConfig.user.providers.github) {
  passport.use(githubStrategy())
}

// Connect to the database middleware
app.use(async (req: Request, res, next) => {
  try {
    // Connect to database
    await connect()
    next()
  } catch (e) {
    logger('ERROR', 'Can not connect to db', e)
    next(e)
  }
})

const logUserIn = async (res, user) => {
  // session is the payload to save in the token, it may contain basic info about the user
  const { username, roles, id } = user
  const session = {
    username,
    roles,
    id,
  }
  // The token is a string with the encrypted session
  const token = await encryptSession(session)

  // Store the activity
  await onUserLogged(user)

  // Add last login information
  await updateOneUser(user.id, {
    metadata: {
      lastLogin: Date.now(),
    },
  })

  setTokenCookie(res, token)

  return token
}

// Normal login
app.post('/api/auth/login', async (req: Request, res) => {
  try {
    const user = await authenticate('local', req, res)

    if (!user) {
      throw new Error('User not found or invalid credentials')
    }

    // Block login if configured to require email verification
    if (
      user &&
      !user.emailVerified &&
      appConfig.user.emailVerification &&
      !user.tokens.length
    ) {
      return res.status(401).json({
        error: 'Email not verified',
      })
    }

    if (user && user.blocked) {
      return res.status(401).json({
        error: 'User blocked',
      })
    }

    const token = await logUserIn(res, user)

    return res.status(200).json({ token, userId: user.id })
  } catch (error) {
    console.error(error)
    return res.status(401).json({ error: error.message })
  }
})

// Verify a user email
app.get('/api/auth/verify', async (req: Request, res) => {
  const email = req.query.email
  const token = req.query.token

  if (!email || !token) {
    res.status(400).json({
      error: 'Invalid request',
    })
  } else {
    const user = await findOneUser({
      email,
    })

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      })
      return
    }

    if (user.emailVerificationToken !== token) {
      res.status(400).json({
        error: 'Invalid token',
      })
      return
    }

    try {
      await updateOneUser(user.id, {
        emailVerified: true,
        emailVerificationToken: null,
      })

      await onEmailVerified(user)

      res.status(200).json({
        verified: true,
      })
    } catch (err) {
      res.status(500).json({
        error: err.message,
      })
    }
  }
})

// Disconnect the user
app.get('/api/auth/logout', async (req: Request, res) => {
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  return res.end()
})

// Create a reset-password request
app.get('/api/auth/reset-password', async (req, res) => {
  const email = req.query.email

  if (!email) {
    res.status(400).json({
      error: 'Invalid request',
    })
  } else {
    const user = await findOneUser({
      email,
    })

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      })
      return
    }

    try {
      const token = uuidv4()

      await updateOneUser(user.id, {
        passwordResetRequest: Date.now(),
        passwordResetToken: token,
      })

      await sendResetPassworEmail(user.email, token)

      res.status(200).json({
        reset: true,
      })
    } catch (e) {
      res.status(500).json({
        error: e.message,
      })
    }
  }
})

// Reset password from a reset-password request
app.post('/api/auth/reset-password', async (req: Request, res) => {
  const email = req.body.email
  const token = req.body.token
  const password = req.body.password

  if (!email || !token || !password) {
    res.status(400).json({
      error: 'Invalid request ',
    })
  } else {
    const user = await findOneUser({
      email,
    })

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      })
      return
    }

    if (user.passwordResetToken !== token) {
      res.status(400).json({
        error: 'Invalid token',
      })
      return
    }

    try {
      const { salt, hash } = generateSaltAndHash(password)

      await updateOneUser(user.id, {
        passwordResetRequest: null,
        passwordResetToken: null,
        salt,
        hash,
      })

      res.status(200).json({
        updated: true,
      })
    } catch (err) {
      res.status(500).json({
        error: err.message,
      })
    }
  }
})

/**
 * OAuth authentication routes. (Sign in)
 */

const oauthCallback = async (provider, req: Request, res) => {
  try {
    const user = await authenticate(provider, req, res)

    // Block login
    if (user && user.blocked) {
      res.status(401).json({
        error: 'User blocked',
      })
      return
    }

    await logUserIn(res, user)

    res.writeHead(302, { Location: '/' })
    return res.end()
  } catch (error) {
    res.writeHead(302, { Location: '/auth/login' })
    return res.end()
  }
}

// Facebook authentication routes
if (appConfig.user.providers.facebook) {
  app.get(
    '/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  )
  app.get('/api/auth/facebook/callback', async (req: Request, res) => {
    await oauthCallback('facebook', req, res)
  })
}

// Github authentication routes
if (appConfig.user.providers.github) {
  app.get('/api/auth/github', passport.authenticate('github'))
  app.get('/api/auth/github/callback', async (req: Request, res) => {
    await oauthCallback('github', req, res)
  })
}

// Google authentication routes
if (appConfig.user.providers.google) {
  app.get(
    '/api/auth/google',
    passport.authenticate('google', {
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
      accessType: 'offline',
      prompt: 'consent',
    })
  )

  app.get('/api/auth/google/callback', async (req: Request, res) => {
    await oauthCallback('google', req, res)
  })
}

// Instagram authentication (deprecated)
if (appConfig.user.providers.instagram) {
  app.get(
    '/api/auth/instagram',
    passport.authenticate('instagram', {
      scope: ['user_profile', 'user_media'],
    })
  )
  app.get(
    '/api/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/auth/login' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: '/' })
      return res.end()
      // res.redirect(req.session.returnTo || '/');
    }
  )
}

// Snapchat authentication
if (appConfig.user.providers.snapchat) {
  app.get('/api/auth/snapchat', passport.authenticate('snapchat'))

  app.get('/api/auth/snapchat/callback', async (req: Request, res) => {
    await oauthCallback('snapchat', req, res)
  })
}

// twitter authentication
if (appConfig.user.providers.twitter) {
  app.get('/api/auth/twitter', passport.authenticate('twitter'))

  app.get('/api/auth/twitter/callback', async (req: Request, res) => {
    await oauthCallback('twitter', req, res)
  })
}

// linkedin authentication
if (appConfig.user.providers.linkedin) {
  app.get(
    '/api/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' })
  )

  app.get('/api/auth/linkedin/callback', async (req: Request, res) => {
    await oauthCallback('linkedin', req, res)
  })
}

// twitch authentication
if (appConfig.user.providers.twitch) {
  app.get('/api/auth/twitch', passport.authenticate('twitch', {}))

  app.get('/api/auth/twitch/callback', async (req: Request, res) => {
    await oauthCallback('twitch', req, res)
  })
}

/**
 * OAuth authorization routes. (API examples)
 */
if (appConfig.user.providers.foursquare) {
  app.get('/api/auth/foursquare', passport.authorize('foursquare'))
  app.get(
    '/api/auth/foursquare/callback',
    passport.authorize('foursquare', { failureRedirect: '/api' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: '/api/foursquare' })
      return res.end()
    }
  )
}

if (appConfig.user.providers.tumblr) {
  app.get('/api/auth/tumblr', passport.authorize('tumblr'))
  app.get(
    '/api/auth/tumblr/callback',
    passport.authorize('tumblr', { failureRedirect: '/api' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: '/api/tumblr' })
      res.end()
    }
  )
}

if (appConfig.user.providers.steam) {
  app.get(
    '/api/auth/steam',
    passport.authorize('openid', { state: 'SOME STATE' })
  )
  app.get(
    '/api/auth/steam/callback',
    passport.authorize('openid', { failureRedirect: '/api' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: req.session.returnTo || '/auth/login' })
      return res.end()
    }
  )
}

if (appConfig.user.providers.pinterest) {
  app.get(
    '/api/auth/pinterest',
    passport.authorize('pinterest', { scope: 'read_public write_public' })
  )
  app.get(
    '/api/auth/pinterest/callback',
    passport.authorize('pinterest', { failureRedirect: '/auth/login' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: '/api/pinterest' })
      return res.end()
    }
  )
}

if (appConfig.user.providers.quickbooks) {
  app.get(
    '/api/auth/quickbooks',
    passport.authorize('quickbooks', {
      scope: ['com.intuit.quickbooks.accounting'],
      state: 'SOME STATE',
    })
  )
  app.get(
    '/api/auth/quickbooks/callback',
    passport.authorize('quickbooks', { failureRedirect: '/auth/login' }),
    (req: Request, res) => {
      res.writeHead(302, { Location: req.session.returnTo || '/auth/login' })
      return res.end()
    }
  )
}

export default app
