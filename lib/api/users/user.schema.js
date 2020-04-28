const { object, string, email } = require('yup')

export default object({
  username: string()
    .required('Username is required')
    .lowercase('Username has to be lowercase')
    .min(3, 'Username minimum length is 3')
    .max(48, 'Username max length is 48'),
  email: string().email().required('Email is required'),
  password: string()
    .required('password is required')
    .min(8, 'password minimum length is 3')
    .max(48, 'password max length is 48'),
})
