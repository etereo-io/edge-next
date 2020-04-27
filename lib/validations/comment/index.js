export function commentValidations(body) {
  return new Promise((resolve, reject) => {
    if (!body.message) {
      reject('Missing comment message')
    } else if (body.message.length > 10000) {
      reject('Message is too long')
    } else {
      resolve()
    }
  })
}
