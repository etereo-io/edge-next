const { object, string, number, array } = require('yup')

export default object({
  firebase: object(),
  language: string().required(),
  users: object(),
  auth: object(),
  contentTypes: array(),
  availableLanguages: array(),
})
