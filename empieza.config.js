const initialContent = [
  {
    type: 'post',
    id: '1',
    title: 'Example post',
    slug: 'example-post',
    description: 'This is an example description',
  },
    {type: 'post',
    id: '2',
    title: 'Example post number 2',
    slug: 'post-number-2',
    description: 'This is an example description',
    image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'
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
        label: 'Title',
        placeholder: 'Title'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description'
      },
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        placeholder: 'Image'
      },
      {
        name: 'file',
        type: 'file',
        label: 'File',
        placeholder: 'File'
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags'
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
