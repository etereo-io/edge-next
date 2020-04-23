import config from '../config'

const content = {}
const comments = {}

config.content.types.forEach((type) => {
  content[type.slug] = `/api/content/${type.slug}`
  comments[type.slug] = `/api/comments/${type.slug}`
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
  comments,
  activity: '/api/activity'
}
