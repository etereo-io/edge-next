import { findOneUser, updateOneUser } from '../../../lib/api/users/user'
import { instagramStrategy, localStrategy } from '../../../lib/api/auth/passport-strategies'
import { onEmailVerified, onUserLogged } from '../../../lib/api/hooks/user.hooks'
import {
  removeTokenCookie,
  setTokenCookie,
} from '../../../lib/api/auth/auth-cookies'

import config from '../../../lib/config'
import { connect } from '../../../lib/api/db'
import { encryptSession } from '../../../lib/api/auth/iron'
import express from 'express'
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

passport.use(localStrategy())

// Configure the different providers
if (config.user.providers.instagram) {
  passport.use(instagramStrategy())
}

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

/**
 * OAuth authentication routes. (Sign in)
 */

if (config.user.providers.instagram) {
  app.get('/api/auth/instagram', passport.authenticate('instagram', { scope: ['user_profile', 'user_media'] }));
  app.get('/api/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/auth/login' }), (req, res) => {
    res.writeHead(302, { Location: '/'})
    res.end()
    // res.redirect(req.session.returnTo || '/');
  });
}


app.get('/api/auth/snapchat', passport.authenticate('snapchat'));
app.get('/api/auth/snapchat/callback', passport.authenticate('snapchat', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/github', passport.authenticate('github'));
app.get('/api/auth/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets.readonly'], accessType: 'offline', prompt: 'consent' }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/twitter', passport.authenticate('twitter'));
app.get('/api/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/api/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/api/auth/twitch', passport.authenticate('twitch', {}));
app.get('/api/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/api/auth/foursquare', passport.authorize('foursquare'));
app.get('/api/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
app.get('/api/auth/tumblr', passport.authorize('tumblr'));
app.get('/api/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
app.get('/api/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/api/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/api' }), (req, res) => {
  res.redirect(req.session.returnTo);
});
app.get('/api/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/api/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});
app.get('/api/auth/quickbooks', passport.authorize('quickbooks', { scope: ['com.intuit.quickbooks.accounting'], state: 'SOME STATE' }));
app.get('/api/auth/quickbooks/callback', passport.authorize('quickbooks', { failureRedirect: '/auth/login' }), (req, res) => {
  res.redirect(req.session.returnTo);
});


export default app
