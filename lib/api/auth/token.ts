import { getTokenCookie } from './auth-cookies'
import jwt from 'jsonwebtoken'

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET ||
  'default-secret-string-that-should-not-be-used'

export function encryptSession(session) {
  return jwt.sign(session, TOKEN_SECRET, {
    expiresIn: '2 days'
  } )
}

export async function getSession(req) {
  const token = getTokenCookie(req)
  
  if (token) {
    return jwt.verify(token, TOKEN_SECRET)
  } else if (req.headers['authorization']) {
    return jwt.verify(req.headers['authorization'].replace('Bearer ', ''), TOKEN_SECRET)
  }

  return null
}
