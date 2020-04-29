import Local from 'passport-local'
import { findUser } from '../users/user'

export const localStrategy = new Local.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  function (email, password, done) {
    findUser({ email, password })
      .then((user) => {
        if (user) {
          // Blocked users can not access
          if (user.blocked) {
            throw new Error('User blocked')
            return
          }
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
