import Local from 'passport-local'
import { findUser } from '../users/user'

export const localStrategy = new Local.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (
  email,
  password,
  done
) {
  
  findUser({ email, password })
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
})
