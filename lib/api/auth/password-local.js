import Local from 'passport-local'
import { findUser } from '../users/user'

export const localStrategy = new Local.Strategy(function (
  username,
  password,
  done
) {
  findUser({ username, password })
    .then((user) => {
      if (user) {
        done(null, user)
      } else {
        throw new Error('User not found')
      }
    })
    .catch((error) => {
      done(error)
    })
})
