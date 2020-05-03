const standardAllowedFields = ['draft']

import { FIELDS } from '../../config/config-constants'

const getValidationErrors = (name, value, fieldDefinition) => {
  const errors = []

  switch(fieldDefinition.type) {
    case FIELDS.TEXT: 
    case FIELDS.TEXTAREA:
      if (typeof fieldDefinition.minlength !== 'undefined' && value.length < fieldDefinition.minlength) {
        errors.push(`${name} length is less than ${fieldDefinition.minlength}`)
      }

      if (typeof fieldDefinition.maxlength !== 'undefined' && value.length > fieldDefinition.maxlength) {
        errors.push(`${name} length is more than ${fieldDefinition.maxlength}`)
      }

      // TODO: test pattern for input
      break;

    case FIELDS.NUMBER:
      if (typeof fieldDefinition.min !== 'undefined' && value * 1 < fieldDefinition.min) {
        errors.push(`${name} is less than ${fieldDefinition.min}`)
      }

      if (typeof fieldDefinition.max !== 'undefined' && value * 1 > fieldDefinition.max) {
        errors.push(`${name} is more than ${fieldDefinition.max}`)
      }
      break;

      // TODO: Validate the other fields
    default: 
      break;
  }


  return errors;
}

export function contentValidations(typeDefinition, content) {
  return new Promise((resolve, reject) => {
    let errors = []

    // Check that only includes fields defined in the configuration
    Object.keys(content).forEach((k) => {
      const fieldDefinition = typeDefinition.fields.find((f) => f.name === k)
      const isStandardField = standardAllowedFields.indexOf(k) !== -1

      if (!fieldDefinition && !isStandardField) {
        errors.push(new Error('Unknown field ' + k))
      }

      if (!isStandardField && fieldDefinition) {
        const value = content[k]
        const name = k
        const validationErrors = getValidationErrors(name, value, fieldDefinition)
        errors = [...errors, ...validationErrors]
      }
    })

    if (errors.length > 0) {
      reject(new Error(errors.join(', ')))
    } else {
      resolve()
    }
  })
}
