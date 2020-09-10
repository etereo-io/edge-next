import config from '../config'

const content = {}

config.content.types.forEach((type) => {
  content[type.slug] = `/api/content/${type.slug}`
})

const groups = {}

config.groups.types.forEach((type) => {
  groups[type.slug] = `/api/groups/${type.slug}`
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
  groups,
  comments: '/api/comments',
  activity: '/api/activity',
  superSearch: '/api/super-search',
  interactions: '/api/interactions',
  email: '/api/email'
}
