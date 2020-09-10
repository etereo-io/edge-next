import { EmailCreationType } from '@lib/types/entities/email'
import MarkdownIt from 'markdown-it'
import { UserType } from '@lib/types'
import callToActionTemplate from './email-templates/call-to-action.template'
import config from '../config'
import sendEmail from './sender'
import standardEmailTemplate from './email-templates/standard-template'

const md = MarkdownIt({
  html: false,
  linkify: true,
})
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

  return sendEmail({
    from: config.emails.from, to, subject, text: textMessage, html
  })

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

  return sendEmail({
    from: config.emails.from, to, subject, text: textMessage, html
  })
}

// send an email after user send request that he want to join to the group.
export function sendRequestToJoinToGroupEmail(to, type, group) {
  const linkToGroup = `${config.url}/group/${type}/${group.slug}`

  const textMessage = `A user wants to join ${group.title}. Go to the user's administration page to approve or deny the membership`
  const subject = `A user wants to join ${group.title}`
  const html = callToActionTemplate({
    intro: 'Hello!',
    message: textMessage,
    buttonLink: linkToGroup,
    buttonText: 'Go to group',
  })

  return sendEmail({ from: config.emails.from, to, subject, text: textMessage, html })
}

export function sendStandardEmail(email: EmailCreationType, user: UserType) {
  const htmlString = md.render(email.text)

  const html = standardEmailTemplate({
    message: htmlString
  })

  return sendEmail({
    from: config.emails.from,
    to: email.to,
    subject: email.subject,
    text: email.text,
    html
  })
}
