import Iron from '@hapi/iron'
import { getTokenCookie } from './auth-cookies'

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET ||
  'default-secret-string-that-should-not-be-used'

export function encryptSession(session) {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export async function getSession(req) {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
