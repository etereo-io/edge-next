export default (parameters = []) => (req, res, cb) => {
  const missing = []
  parameters.forEach(p => {
    if (!req.query[p]) {
      missing.push(p)
    }
  })
  
  if (missing.length > 0) {
    cb(new Error('Missing parameters ' + missing.join(',')))
  } else {
    cb()
  }
}