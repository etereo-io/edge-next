// This middleware parses content types form data

import formidable from 'formidable'

export default (fieldDefinitions = [], cb) => (req, res) => {
  const form = formidable({ multiples: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({error: err.message})
      return
    }

    const newFields = {...fields}

    // Parse nested objects in formData. In JSON mode should not happen
    fieldDefinitions.forEach(field => {
      console.log(newFields[field.name])
      console.log(typeof newFields[field.name])
      if(newFields[field.name] && field.type === 'tags' && typeof newFields[field.name] === 'string') {
        try {
          newFields[field.name] = JSON.parse(newFields[field.name])
        } catch(err) {
          // Invalid field data, shouldn't happen
          newFields[field.name] = null
        }
      }
    })
    
    req.body = newFields
    req.files = files
    cb(req, res)
  });
}