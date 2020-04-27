export default (parameters = []) => (req, res, cb) => {
  const missing = []
  parameters.forEach((p) => {
    if (typeof req.query[p] === 'undefined') {
      missing.push(p)
    }
  })

  if (missing.length > 0) {
    cb(new Error('Missing parameters ' + missing.join(',')))
  } else {
    cb()
  }
}
