import config from './config'

const content = {}

config.content.types.forEach((type) => {
  content[type.slug] = `/api/content/${type.slug}`
})

const users = '/api/users'
const auth = {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  signup: '/api/auth/signup',
}

export default {
  users,
  auth,
  content,
}
