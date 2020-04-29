import {
  removeTokenCookie,
  setTokenCookie,
} from '../../../lib/api/auth/auth-cookies'

import { connect } from '../../../lib/api/db'
import { encryptSession } from '../../../lib/api/auth/iron'
import express from 'express'
import { localStrategy } from '../../../lib/api/auth/password-local'
import { onUserLogged } from '../../../lib/api/hooks/user.hooks'
import passport from 'passport'
import { updateOneUser } from '../../../lib/api/users/user'

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
    await updateOneUser({
      email: user.email
    }, {
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

app.get('/api/auth/logout', async (req, res) => {
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  res.end()
})


export default app
