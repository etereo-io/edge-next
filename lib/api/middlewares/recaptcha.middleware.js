// const querystring = require('querystring')

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

async function validateRecaptchaToken(token) {
  try {
    if (!RECAPTCHA_SECRET_KEY) {
      log.error(`Recaptcha secret key was not found`)
      return { success: false }
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: RECAPTCHA_SECRET_KEY, //	Required. The shared key between your site and reCAPTCHA.
        response: token //	Required. The user response token provided by the reCAPTCHA client-side integration on your site.
      })
    )

    log.info(
      `Response of recaptcha validation: ${JSON.stringify(response.data)}`
    )

    return response.data
  } catch (error) {
    log.error(`Error validating recaptcha: ${JSON.stringify(error)}`)
    return { success: false }
  }
}

module.exports = { validateRecaptchaToken }


export default async function validateRecaptchaMiddleware(req, res, next) {
  const headers = req.headers
  const recaptchaToken = headers['recaptcha-token']
  if (!recaptchaToken) {
    next()
  } else {
    // Validate recaptcha token against google api
    const result = await validateRecaptchaToken(recaptchaToken)
    if (result.success !== true) { 
      // TODO: establish score threshold
      next(new Error('Petición no válida'))
      return
    }
    next()
  }
}