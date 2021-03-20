import { getSession } from '../auth/token'

export default async (req, res, cb) => {
  try {
    const session = await getSession(req)
    req.currentUser = session
    cb()
  } catch (err) {
    cb(err)
  }
}
