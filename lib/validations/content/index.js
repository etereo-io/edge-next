export function contentValidations(typeDefinition, content) {
  return new Promise((resolve, reject) => {
    const errors = []

    Object.keys(content).forEach((k) => {
      const fieldDefinition = typeDefinition.fields.find((f) => f.name === k)

      if (!fieldDefinition) {
        errors.push(new Error('Unknown field ' + k))
      }
      // TODO do more validations
    })

    if (errors.length > 0) {
      reject(errors)
    } else {
      resolve()
    }
  })
}
