import slugify from 'slugify'

export function fillContentWithDefaultData(contentType, content, user) {
  try {
    const defaultEmptyFields = {}

    contentType.fields.forEach((f) => {
      defaultEmptyFields[f.name] = f.defaultValue || null
    })

    // Fill in the mandatory data like author, date, type
    const newContent = {
      author: user.id,
      createdAt: Date.now(),
      type: contentType.slug,
      ...defaultEmptyFields,
      ...content,
    }

    const slug = slugify(
      contentType.slugGeneration.reduce(
        (prev, next) =>
          prev + ' ' + (next !== 'userId' ? newContent[next] : user.id),
        ''
      ),
      {
        lower: true,
        strict: true,
      }
    )

    const extraFields = {
      slug: slug,
    }

    return Object.assign({}, newContent, extraFields)
  } catch (err) {
    throw new Error('Invalid slug or default data generation ' + err.message)
  }
}