import logger from '@lib/logger'
import sendgrid from '@sendgrid/mail'

const config = {
  sendgridKey: process.env.SENDGRID_KEY,
}

try {
  sendgrid.setApiKey(config.sendgridKey)
} catch (e) {
  logger('ERROR', e.message)
}

export default function send(
  from,
  to,
  subject = 'Email subject',
  text = 'Email body',
  html = '<p>Email body</p>'
) {
  if (config.sendgridKey) {
    return sendgrid.send({
      to,
      from,
      subject,
      text,
      html,
    }).catch(err => {
      logger('ERROR', 'Could not send email ' + err.message)
    })
  } else {
    logger('ERROR', 'Missing SENDGRID_KEY environment variable, not sending emails')
    return Promise.resolve()
  }
}
