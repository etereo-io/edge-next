const standardAllowedFields = ['draft', 'permissions', 'comments', 'purchasingOptions', 'seo']

import {
  PurchashingOptionsType,
} from '@lib/types/purchasing'
import { SEOPropertiesType } from '@lib/types/seo'
import {
  validateField,
} from '../fields'

function validatePurchasingOptions(purchasingOptions: PurchashingOptionsType) {
  const errors = []

  if (!purchasingOptions.currency) {
    errors.push('Missing currency')
  }

  if (!purchasingOptions.price) {
    errors.push('Price can not be empty')
  }

  return errors
}

function validateSeoField(seo: SEOPropertiesType) {
  const errors = []

  if (!seo.slug) {
    errors.push('Missing slug')
  }

  if (!seo.title) {
    errors.push('Title can not be empty')
  }

  return errors
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

      const value = content[k]

      if (!isStandardField && fieldDefinition) {
        const name = k
        const validationErrors = validateField(
          name,
          value,
          fieldDefinition
        )
        errors = [...errors, ...validationErrors]
      } else if (isStandardField) {
        // Validate standard fields
        switch (k) {
          case 'draft':
            if (typeof (value) !== 'boolean') {
              errors.push('Invalid draft value')
            }
            break;
          case 'seo':
            const seoError = validateSeoField(value)
            errors = [...seoError, ...errors]
            break;
          case 'permissions':
            if (typeof (value) !== 'object') {
              errors.push('Invalid permissions value')
            }
            break;
          case 'purchasingOptions':
            const purchasingOptionsErrors = validatePurchasingOptions(value)
            errors = [...purchasingOptionsErrors, ...errors]
            break;
          default:
            break;
        }
      }
    })

    if (errors.length > 0) {
      reject(new Error(errors.join(', ')))
    } else {
      resolve()
    }
  })
}