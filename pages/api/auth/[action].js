import { findOneUser, updateOneUser } from '../../../lib/api/users/user'
import { onEmailVerified, onUserLogged } from '../../../lib/api/hooks/user.hooks'
import {
  removeTokenCookie,
  setTokenCookie,
} from '../../../lib/api/auth/auth-cookies'

import { connect } from '../../../lib/api/db'
import { encryptSession } from '../../../lib/api/auth/iron'
import express from 'express'
import { localStrategy } from '../../../lib/api/auth/password-local'
import passport from 'passport'

const app = express()
const authenticate = (method, req, res) =>
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

passport.use(localStrategy)

app.use(async (req, res, next) => {
  try {
    // Connect to database
    await connect()
    next()
  } catch (e) {
    console.log(e)
    next(e)
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await authenticate('local', req, res)

    if (!user) {
      throw new Error('User not found or invalid credentials')
    }

    // session is the payload to save in the token, it may contain basic info about the user
    const session = { ...user }
    // The token is a string with the encrypted session
    const token = await encryptSession(session)

    // Store the activity
    onUserLogged(session)

    // Add last login information
    await updateOneUser(user.id, {
      metadata: {
        lastLogin: Date.now()
      }
    })

    setTokenCookie(res, token)
    res.status(200).json({ done: true })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: error.message })
  }
})

// Verify a user email
app.get('/api/auth/verify', async (req, res) => {
  const email = req.query.email
  if (!email) {
    res.writeHead(302, { Location: '/404' })
    res.end()
  } else {
    const user = await findOneUser({
      email
    })

    if (!user) {
      res.writeHead(302, { Location: '/404' })
      res.end()
      return
    }

    await updateOneUser(user.id, {
      email_verified: true
    })

    await onEmailVerified(user)

    // TODO: Show a confirmation on the client side
    res.writeHead(302, { Location: '/login?verified=true' })
    res.end()
  }
})

app.get('/api/auth/logout', async (req, res) => {
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  res.end()
})


export default app
