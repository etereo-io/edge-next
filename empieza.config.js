const initialContent = [
  {
    type: 'post',
    id: '1',
    title: 'Example post',
    description: 'This is an example description',
  },
]

module.exports = (defaultOptions) => {
  const postContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },
    slug: 'post',
    permissions: {
      read: ['public'],
      write: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
    },

    fields: [
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'image',
        type: 'img',
      },
      {
        name: 'file',
        type: 'file',
      },
      {
        name: 'tags',
        type: 'tags',
      },
    ],
  }

  return {
    title: 'Dashboard Demo',
    storage: {
      type: 'firestore',
    },
    database: {
      type: 'IN_MEMORY',
    },
    content: {
      types: [postContentType],
      initialContent: initialContent,
    },
    tags: {
      initialTags: [
        {
          slug: 'software',
          label: {
            en: 'Software',
            es: 'Software',
          },
        },
        {
          slug: 'ai',
          label: {
            en: 'Artificial Inteligence',
            es: 'Inteligencia Artificial',
          },
        },
      ],
    },
  }
}
