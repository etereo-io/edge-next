const posts = []
const products = []
const comments = []

for (var i = 0; i < 100; i++) {
  posts.push({
    type: 'post',
    id: i,
    author: Math.round(Math.random() * 10),
    title: 'Example post',
    slug: 'example-post-' + i,
    image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    description: 'This is an example description',
    tags: ['software', 'ai'],
  })
  products.push({
    type: 'product',
    id: i,
    author: Math.round(Math.random() * 10),
    title: 'Example product',
    slug: 'example-product-' + i,
    description: 'This is an example description',
  })

  for(var j = 0; j < 50; j++) {
    comments.push({
      type: 'comment',
      contentType: 'post',
      contentId: i,
      message: 'A demo comment',
      author: Math.round(Math.random() * 10),
      slug: 'test-comment-' + j
    })
  }
}

const initialContent = [
  ...posts,
  ...products,
  ...comments
]

module.exports = (defaultOptions) => {
  const postContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },

    slug: 'post',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['public'],
      write: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      approval: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user]
    },

    publishing: {
      needsApproval: true,
      allowsDraft: true,
    },

    comments: {
      enabled: true,
      permissions: {
        read: ['public'],
        write: [defaultOptions.roles.user, defaultOptions.roles.admin],
        delete: [defaultOptions.roles.admin],
        admin: [defaultOptions.roles.admin],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
      },
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
      },
      {
        name: 'file',
        type: 'file',
        label: 'File',
        placeholder: 'File',
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags',
      },
    ],
  }

  const productContentType = {
    title: {
      en: 'Product',
      es: 'Producto',
    },

    slug: 'product',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['public'],
      write: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      approval: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user]
    },

    publishing: {
      needsApproval: true,
      allowsDraft: true,
    },

    comments: {
      enabled: false,
      permissions: {
        read: ['public'],
        write: [defaultOptions.roles.user, defaultOptions.roles.admin],
        delete: [defaultOptions.roles.admin],
        admin: [defaultOptions.roles.admin],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
      },
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        multiple: true,
        placeholder: 'Image',
      },
      {
        name: 'stocknumber',
        type: 'text',
        label: 'Stock Number',
        placeholder: 'SKU',
      },
      {
        name: 'price',
        type: 'number',
        label: 'Price',
        placeholder: 'Price',
      },
      {
        name: 'stockamount',
        type: 'number',
        label: 'Stock Amount',
        placeholder: 'Stock Amount',
      },
    ],
  }

  return {
    title: 'The Demo Site',
    storage: {
      type: 'firestore',
    },
    database: {
      type: 'IN_MEMORY',
    },
    content: {
      types: [postContentType, productContentType],
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
