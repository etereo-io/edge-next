import {
  createUser,
  findOneUser,
  findUserWithPassword,
} from '@lib/api/entities/users'

import FacebookStrategy from 'passport-facebook'
import GithubStrategy from 'passport-github2'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import Local from 'passport-local'
import { getSession } from './token'
import logger from '@lib/logger'
import slugify from 'slugify'

// import LinkedinStrategy from 'passport-linkedin-oauth2'
// import TwitchStrategy from 'passport-twitch-new'
// import TwitterStrategy from 'passport-twitter'
// import SnapchatStrategy from 'passport-snapchat'
// const { OAuthStrategy } = require('passport-oauth');
// const { OAuth2Strategy } = require('passport-oauth');

export const localStrategy = () =>
  new Local.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      findUserWithPassword({ email, password })
        .then((user) => {
          if (user) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
        .catch((error) => {
          done(error)
        })
    }
  )

/**
 * Sign in with Facebook.
 */
export const facebookStrategy = () =>
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
      profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const facebookToken = { kind: 'facebook', accessToken }
      const displayName = `${profile.name.givenName} ${profile.name.familyName}`
      const picture = `https://graph.facebook.com/${profile.id}/picture?type=large`
      const gender = profile._json.gender
      const email = profile._json.email
      const location = profile._json.location
      ? profile._json.location.name
      : ''
      const session = await getSession(req)

      // Update existing user with facebook data
      function updateExistingUser(user) {
        return updateOneUser(user.id, {
          facebook: profile.id,
          profile: {
            ...user.profile,
            picture: user.profile.picture && user.profile.picture.path ? user.profile.picture : {
              source: 'facebook',
              path: picture,
            },
            location: user.profile.location || location,
            gender: user.profile.gender || gender,
            displayName: user.profile.displayName || displayName
          },
          tokens: [...user.tokens, facebookToken],
        })

      }
      
      if (session) {
        // User is logged, we are linking his account

        try {
          const existingUser = await findOneUser({ facebook: profile.id })
          if (existingUser) {
            // There is already one user with this facebook
            const err =
              'There is already a facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
            done(err)
          } else {
            // We found a user with this ID
            const user = await findOneUser({ id: session.id })
            const newUser = await updateExistingUser(user)
            done(null, newUser)
          }
        } catch (err) {
          logger('ERROR', 'Error authenticating with Facebook', err)
          return done(err)
        }
      } else {
        try {
          const existingUser = await findOneUser({ facebook: profile.id })

          if (existingUser) {
            // Already exists, log in with that user
            return done(null, existingUser)
          } else {
            if (email) {
              const userWithEmail = await findOneUser({ email })
              
              if (userWithEmail) {
                const newUser = await updateExistingUser(userWithEmail)
                done(null, newUser)
                return 
              }
            }
            
            const user = {
              facebook: profile.id,
              tokens: [facebookToken],
              email,
              username: slugify(displayName + '-' + Date.now(), {
                lower: true,
                strict: true,
              }),
              profile: {
                displayName,
                gender,
                location,
                picture: {
                  source: 'facebook',
                  path: picture,
                },
              },
            }

            const result = await createUser(user)

            done(null, result)
          }
        } catch (err) {
          console.error('Error registering with facebook', err)
          return done(err)
        }
      }
    }
  )

/**
 * Sign in with Github.
 */
export const githubStrategy = () =>
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
      scope: ['user:email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {

      // Data to be added
      const githubToken = { kind: 'github', accessToken }

      const email = profile.emails[0] ? profile.emails[0].value : null

      const displayName = profile.displayName || profile.username

      const picture = profile._json.avatar_url

      const location = profile._json.location

      const website = profile._json.blog

      const github = profile.profileUrl

      const session = await getSession(req)

      // Update existing user with github data
      function updateExistingUser(user) {
        return updateOneUser(user.id, {
          github: profile.id,
          profile: {
            ...user.profile,
            picture: user.profile.picture && user.profile.picture.path ? user.profile.picture : {
              source: 'github',
              path: picture,
            },
            location: user.profile.location || location,
            website: user.profile.website || website,
            github: user.profile.github || github,
            displayName: user.profile.displayName || displayName
          },
          tokens: [...user.tokens, githubToken],
        })

      }


      if (session) {
        // User is logged, we are linking his account

        try {
          const existingUser = await findOneUser({ github: profile.id })
          if (existingUser) {
            // There is already one user with this facebook
            const err =
              'There is already a Github account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
            done(err)
          } else {
            // We found a user with this ID
            const user = await findOneUser({ id: session.id })
            const newUser = await updateExistingUser(user)
            done(null, newUser)
          }
        } catch (err) {
          logger('ERROR', 'Error authenticating with Github', err)
          return done(err)
        }
      } else {
        try {
          const existingUser = await findOneUser({ github: profile.id })

          if (existingUser) {
            // Already exists, log in with that user
            return done(null, existingUser)
          } else {
            
            if (email) {
              const userWithEmail = await findOneUser({ email })
              
              if (userWithEmail) {
                const newUser = await updateExistingUser(userWithEmail)
                done(null, newUser)
                return 
              }
            }
            
            // Does not exist, lets create a new user
            const user = {
              github: profile.id,
              tokens: [githubToken],
              email: email,
              username: slugify(displayName + '-' + Date.now(), {
                lower: true,
                strict: true,
              }),
              profile: {
                displayName,
                picture: {
                  source: 'github',
                  path: picture,
                },
                location,
                github,
                website,
              },
            }

            const result = await createUser(user)

            done(null, result)
          }
        } catch (err) {
          console.error('Error registering with Github', err)
          return done(err)
        }
      }
    }
  )

/**
 * Sign in with Google.
 */
export const googleStrategy = () =>
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, params, profile, done) => {

      const googleToken = {
        kind: 'google',
        accessToken,
        //accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
        refreshToken,
      }

      const email = profile.emails[0].value

      const displayName = `${profile.displayName}`

      const picture = profile._json.picture

      const gender = profile._json.gender

      const session = await getSession(req)

      // Update existing user with google data
      function updateExistingUser(user) {
        return updateOneUser(user.id, {
          google: profile.id,
          profile: {
            ...user.profile,
            picture: user.profile.picture && user.profile.picture.path ? user.profile.picture : {
              source: 'google',
              path: picture,
            },
            gender: user.profile.gender || gender,
    
            displayName: user.profile.displayName || displayName
          },
          tokens: [...user.tokens, googleToken],
        })

      }


      if (session) {
        // User is logged, we are linking his account

        try {
          const existingUser = await findOneUser({ google: profile.id })
          if (existingUser) {
            // There is already one user with this facebook
            const err =
              'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
            done(err)
          } else {
             // We found a user with this ID
             const user = await findOneUser({ id: session.id })
             const newUser = await updateExistingUser(user)
             done(null, newUser)
          }
        } catch (err) {
          logger('ERROR', 'Error authenticating with Google', err)
          return done(err)
        }
      } else {
        try {
          const existingUser = await findOneUser({ google: profile.id })

          if (existingUser) {
            // Already exists, log in with that user
            return done(null, existingUser)
          } else {
            if (email) {
              const userWithEmail = await findOneUser({ email })
              
              if (userWithEmail) {
                const newUser = await updateExistingUser(userWithEmail)
                done(null, newUser)
                return 
              }
            }
            
            // Does not exist, lets create a new user
            const user = {
              google: profile.id,
              tokens: [googleToken],
              email: email,
              username: slugify(displayName + '-' + Date.now(), {
                lower: true,
                strict: true,
              }),
              profile: {
                displayName,
                picture: {
                  source: 'google',
                  path: picture,
                },
                gender,
              },
            }

            const result = await createUser(user)

            done(null, result)
          }
        } catch (err) {
          console.error('Error registering with Google', err)
          return done(err)
        }
      }
    }
  )

/*

Instagram 

export const instagramStrategy = () =>
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_ID,
      clientSecret: process.env.INSTAGRAM_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/instagram/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const session = await getSession(req)
      if (session) {
        // User is logged, we are linking his account
        try {
          const existingUser = await findOneUser({ instagram: profile.id })
          if (existingUser) {
            // There is already one user with this instagram
            const err =
              'There is already an Instagram account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
            done(err)
          } else {
            // We found a user with this ID
            const user = await findOneUser({ id: session.id })

            const instagramToken = { kind: 'instagram', accessToken }

            const displayName = user.profile.displayName || profile.displayName

            // Update profile picture of the user
            const picture =
              user.profile.picture || profile._json.data.profile_picture

            const website = user.profile.website || profile._json.data.website

            // Instagram account was linked
            await updateOneUser(user.id, {
              instagram: profile.id,
              profile: {
                ...user.profile,
                picture,
                website,
                displayName,
              },
              tokens: [...user.tokens, instagramToken],
            })

            done()
          }
        } catch (err) {
           logger('ERROR', 'Error authenticating with IG', err)
          return done(err)
        }
      } else {
        try {
          const existingUser = await findOneUser({ instagram: profile.id })

          if (existingUser) {
            // Already exists, log in with that user
            return done(null, existingUser)
          } else {
            // Does not exist, lets create a new user
            const instagramToken = { kind: 'instagram', accessToken }
            // Similar to Twitter API, assigns a temporary e-mail address
            // to get on with the registration process. It can be changed later
            // to a valid e-mail address in Profile Management.
            const temporaryEmail = `${profile.username}@instagram.com`
            const user = {
              instagram: profile.id,
              tokens: [instagramToken],
              email: temporaryEmail,
              username: profile.username,
              profile: {
                displayName: profile.displayName,
                website: profile._json.data.website,
                picture: profile._json.data.profile_picture,
              },
            }

            const result = await createUser(user)
            done(null, result)
          }
        } catch (err) {
          console.error('Error registering with ig', err)
          return done(err)
        }
      }
    }
  )
*/
