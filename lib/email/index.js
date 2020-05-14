import callToActionTemplate from './email-templates/call-to-action.template'
import config from '../config'
import sendEmail from './sender'

// Send an email to verify the new email address
export const sendVerifyEmail = (to, token) => {
  const linkToVerifyEmail = `${
    config.url
  }/auth/verify?email=${to}&date=${Date.now()}&token=${token}`

  const textMessage = `Please copy and paste the following link in your browser to verify your email address: ${linkToVerifyEmail}`
  const subject = `${config.title} -- Please verify your email address to continue`
  const html = callToActionTemplate({
    intro: 'Hello!',
    message: textMessage,
    buttonLink: linkToVerifyEmail,
    buttonText: 'Verify your email',
  })

  return sendEmail(config.emails.from, to, subject, textMessage, html)
}


// Send an email to update password
export const sendResetPassworEmail = (to, token) => {
  const linkToResetPassword = `${
    config.url
  }/auth/reset-password-verify?email=${to}&date=${Date.now()}&token=${token}`

  const textMessage = `Please copy and paste the following link in your browser to update your password: ${linkToResetPassword}. \n If you didn't request to reset your password, please, ignore this message.`
  const subject = `${config.title} -- reset my password`
  const html = callToActionTemplate({
    intro: 'Hello!',
    message: textMessage,
    buttonLink: linkToResetPassword,
    buttonText: 'Reset my password',
  })

  return sendEmail(config.emails.from, to, subject, textMessage, html)
}