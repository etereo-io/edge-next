import { FIELDS } from '../config/config-constants'

export const validateField = (name, value, fieldDefinition) => {
  const errors = []

  switch (fieldDefinition.type) {
    case FIELDS.TEXT:
    case FIELDS.TEXTAREA:
      if (
        typeof fieldDefinition.minlength !== 'undefined' &&
        value.length < fieldDefinition.minlength
      ) {
        errors.push(`${name} length is less than ${fieldDefinition.minlength}`)
      }

      if (
        typeof fieldDefinition.maxlength !== 'undefined' &&
        value.length > fieldDefinition.maxlength
      ) {
        errors.push(`${name} length is more than ${fieldDefinition.maxlength}`)
      }

      // TODO: test pattern for input
      break

    case FIELDS.NUMBER:
      if (
        typeof fieldDefinition.min !== 'undefined' &&
        value * 1 < fieldDefinition.min
      ) {
        errors.push(`${name} is less than ${fieldDefinition.min}`)
      }

      if (
        typeof fieldDefinition.max !== 'undefined' &&
        value * 1 > fieldDefinition.max
      ) {
        errors.push(`${name} is more than ${fieldDefinition.max}`)
      }
      break

    // TODO: Validate the other fields
    default:
      break
  }

  return errors
}