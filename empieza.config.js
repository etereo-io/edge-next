const posts = []

for (var i = 0; i < 100; i++) {
  posts.push({
    type: 'post',
    id: i,
    author: '1',
    title: 'Example post',
    slug: 'example-post-' + i,
    image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    description: 'This is an example description',
    tags: ['software', 'ai']
  })
}

const initialContent = [
  ...posts,
  {
    type: 'comment',
    contentType: 'post',
    contentId: '1',
    message: 'A demo comment'
  },
  {
    type: 'comment',
    contentType: 'post',
    contentId: '2',
    message: 'A 2 demo comment'
  },
  
   {
     type: 'comment',
    contentType: 'post',
    contentId: '2',
    message: 'A demo comment'
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

    comments: {
      enabled: true,
      permissions: {
        read: ['public'],
        write: [defaultOptions.roles.user, defaultOptions.roles.admin],
        delete: [defaultOptions.roles.admin],
        admin: [defaultOptions.roles.admin],
      }
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
    title: 'Software Posts',
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
    tags: [
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
    
  }
}
