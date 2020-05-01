import { findOneUser, updateOneUser } from '../../../lib/api/users/user'
import { onEmailVerified, onUserLogged } from '../../../lib/api/hooks/user.hooks'
import {
  removeTokenCookie,
  setTokenCookie,
} from '../../../lib/api/auth/auth-cookies'

import config from '../../../lib/config'
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

    // Block login if configured to require email verifiation
    if (user && !user.emailVerified && config.user.emailVerification) {
      res.status(401).json({
        error: 'Email not verified'
      })
      return
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
  const token = req.query.token
  
  if (!email || !token) {
    res.status(400).json({
      error: 'Invalid request'
    })
  } else {
    const user = await findOneUser({
      email
    })

    if (!user ) {
      res.status(404).json({
        error: 'User not found'
      })
      return
    }
    
    if (user.emailVerificationToken !== token) {
      res.status(400).json({
        error: 'Invalid token'
      })
      return
    }

    try {
      await updateOneUser(user.id, {
        emailVerified: true,
        emailVerificationToken: null
      })
  
      await onEmailVerified(user)
  
      // TODO: Show a confirmation on the client side
      res.status(200).send({
        verified: true
      })
    } catch (err) {
      res.status(500).json({
        error: err.message
      })
    }
  }
})

app.get('/api/auth/logout', async (req, res) => {
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  res.end()
})


export default app
