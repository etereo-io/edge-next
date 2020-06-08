const standardAllowedFields = ['draft', 'permissions', 'comments']

import { validateField } from '../fields'

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
        const validationErrors = validateField(
          name,
          value,
          fieldDefinition
        )
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
