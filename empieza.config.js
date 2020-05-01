const posts = []
const products = []
const comments = []
const initialActivity = []

for (var i = 0; i < 100; i++) {
  const userId = Math.round(Math.random() * 10)

  posts.push({
    type: 'post',
    id: i,
    author: userId,
    title: 'Example post',
    slug: 'example-post-' + i,
    image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    description: 'This is an example description',
    tags: [
      {
        slug: 'software',
        label: 'SOFTWARE',
      },
      {
        slug: 'ai',
        label: 'AI',
      },
    ],
  })

  products.push({
    type: 'product',
    id: i,
    author: userId,
    title: 'Example product',
    slug: 'example-product-' + i,
    description: 'This is an example description',
  })

  initialActivity.push({
    author: userId,
    type: 'content_added',
    meta: {
      contentTitle: 'Example post', // This will not work with dynamic fields
      contentType: 'post',
      contentId: i,
    },
  })

  initialActivity.push({
    author: userId,
    type: 'content_added',
    meta: {
      contentTitle: 'Example product', // This will not work with dynamic fields
      contentType: 'product',
      contentId: i,
    },
  })

  for (var j = 0; j < 50; j++) {
    comments.push({
      type: 'comment',
      contentType: 'post',
      contentId: i,
      message: 'A demo comment',
      author: Math.round(Math.random() * 10),
      slug: 'test-comment-' + j,
    })

    initialActivity.push({
      author: userId,
      type: 'comment_added',
      meta: {
        commentId: j,
        contentId: i,
        contentType: 'post',
      },
    })
  }
}

const initialContent = [...posts, ...products, ...comments]

export const getConfig = (defaultOptions) => {
  const postContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },

    slug: 'post',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['PUBLIC'],
      create: [defaultOptions.roles.admin, defaultOptions.roles.user],
      update: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      approval: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user],
    },

    publishing: {
      needsApproval: true,
      allowsDraft: true,
    },

    comments: {
      enabled: true,
      permissions: {
        read: ['PUBLIC'],
        create: [defaultOptions.roles.user, defaultOptions.roles.admin],
        update: [defaultOptions.roles.user, defaultOptions.roles.admin],
        delete: [defaultOptions.roles.admin],
        admin: [defaultOptions.roles.admin],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        title: true,
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
      {
        name: 'draft',
        type: 'radio',
        label: 'Draft',
        options: [{
          label: 'true',
          value: true
        }, {
          label: 'false',
          value: false
        }],
      }
    ],
  }

  const ProfilePictureContent = {
    title: {
      en: 'Picture',
      es: 'Foto'
    },

    slug: 'picture',

    slugGeneration: ['userId', 'createdAt'],

    permissions: {
      read: [defaultOptions.roles.user, defaultOptions.roles.admin],
      create: [defaultOptions.roles.admin, defaultOptions.roles.user],
      update: [defaultOptions.roles.admin],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    fields: [
      {
        name: 'image',
        type: 'img',
        label: 'Image',
        required: true,
        placeholder: 'Image',
      },
    ]
  }

  const LikeContent = {
    title: {
      en: 'Like',
      es: 'Like'
    },

    slug: 'like',

    slugGeneration: ['userId', 'createdAt'],

    permissions: {
      read: [defaultOptions.roles.user, defaultOptions.roles.admin],
      create: [defaultOptions.roles.admin, defaultOptions.roles.user],
      update: [defaultOptions.roles.admin],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    fields: [
      {
        name: 'userFrom',
        type: 'text',
        label: 'User from',
        required: true,
        placeholder: 'user from',
      },
      {
        name: 'userTo',
        type: 'text',
        label: 'User to',
        required: true,
        placeholder: 'user to',
      },
      {
        name: 'status',
        type: 'select',
        options: [{
          label: 'Like',
          value: 'like'
        }, {
          label: 'Dislike',
          value: 'dislike'
        }],
        label: 'status',
        required: true,
        placeholder: 'status',
      },
    ]
  }

  const MatchContent = {
    title: {
      en: 'Match',
      es: 'Match'
    },

    slug: 'match',

    slugGeneration: ['participants' , 'createdAt'],

    permissions: {
      read: [defaultOptions.roles.user, defaultOptions.roles.admin],
      create: [defaultOptions.roles.admin],
      update: [defaultOptions.roles.admin],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    fields: [
      {
        name: 'participants',
        type: 'json',
        label: 'participants',
        required: true,
        placeholder: 'participants',
      },
      {
        name: 'deleted',
        type: 'radio',
        options: [{
          label: 'true',
          value: true
        }, {
          label: 'false',
          value: false
        }],
        label: 'deleted',
        placeholder: 'deleted',
      },
    ]
  }

  
  const MessageContent = {
    title: {
      en: 'Message',
      es: 'Message'
    },

    slug: 'message',

    slugGeneration: ['userId' , 'createdAt'],

    permissions: {
      read: [defaultOptions.roles.user, defaultOptions.roles.admin],
      create: [defaultOptions.roles.admin],
      update: [defaultOptions.roles.admin],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    fields: [
      {
        name: 'userFrom',
        type: 'text',
        label: 'user from',
        required: true,
        placeholder: 'user from (UID)',
      },
      {
        name: 'message',
        type: 'text',
        label: 'message',
        required: true,
        placeholder: 'message',
      },
      {
        name: 'matchId',
        type: 'text',
        label: 'matchId',
        required: true,
        placeholder: 'matchId',
      },
      {
        name: 'deleted',
        type: 'boolean',
        label: 'deleted',
        placeholder: 'deleted',
      }
    ]
  }

  const productContentType = {
    title: {
      en: 'Product',
      es: 'Producto',
    },

    slug: 'product',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: ['PUBLIC'],
      create: [defaultOptions.roles.admin, defaultOptions.roles.user],
      update: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      admin: [defaultOptions.roles.admin],
      approval: [defaultOptions.roles.admin],
      report: [defaultOptions.roles.user],
    },

    publishing: {
      needsApproval: true,
      allowsDraft: true,
    },

    comments: {
      enabled: false,
      permissions: {
        read: ['PUBLIC'],
        create: [defaultOptions.roles.user, defaultOptions.roles.admin],
        update: [defaultOptions.roles.admin, defaultOptions.roles.user],
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
        title: true,
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
    // Title for the site
    title: 'The Demo Site',

    // Meta description
    description: 'A super NextJS demo site starter pro pack super sexy',

    // Home slogan
    slogan: 'A site that is dynamic',

    storage: {
      type: 'firestore',
    },

    // Choose from MONGO, FIREBASE, IN_MEMORY
    database: {
      type: 'IN_MEMORY',
    },

    // Used for e-mails and links
    url: 'www.demosite.com',
    
    emails: {
      from: 'no-reply@empieza.io',
      contact: 'contact@empieza.io'
    },

    // Users activity logging & API
    activity: {

      // Enables Activity API and stores content, comment and user activities,
      enabled: true, 
      permissions: {
        content: {
          created: ['PUBLIC'],
          deleted: [defaultOptions.roles.admin],
          edited: [defaultOptions.roles.admin],
        },
        comments: {
          created: ['PUBLIC'],
          deleted: [defaultOptions.roles.admin],
          edited: [defaultOptions.roles.admin],
        },
        users: {
          created: [defaultOptions.roles.admin],
          deleted: [defaultOptions.roles.admin],
          edited: [defaultOptions.roles.admin],
        },
      },
      initialActivity: initialActivity,
    },

    // Users configuration
    user: {
      // Capture user geolocation and enable geolocation display on the admin dashboard
      captureGeolocation: true,

      // Require email verification
      emailVerification: true,

      // Fields for the users profiles
      profile: {
        fields: [{
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          min: 60,
          max: 300,
        }]
      },

      // Initial users data for testing purposes
      initialUsers: [
        {
          username: 'admin',
          displayname: 'The admin',
          email: 'admin@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: [defaultOptions.roles.admin, defaultOptions.roles.user],
          id: '1',
          password: 'admin',
          profile: {
            img: '/static/demo-images/default-avatar.jpg',
          },
          metadata: {
            lastLogin: null
          }
        },
        {
          username: 'user',
          email: 'user@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: [defaultOptions.roles.user],
          id: '2',
          password: 'user',
          profile: {
            img: '',
          },
          metadata: {
            lastLogin: null
          }
        },
        {
          username: 'blocked',
          email: 'blocked@demo.com',
          emailVerified: true,
          createdAt: Date.now(),
          roles: [defaultOptions.roles.user],
          id: '3',
          password: 'user',
          profile: {
            img: '',
          },
          blocked: true,
          metadata: {
            lastLogin: null
          }
        },
        {
          username: 'notverified',
          email: 'notverified@demo.com',
          emailVerified: false,
          emailVerificationToken: '1234',
          createdAt: Date.now(),
          roles: [defaultOptions.roles.user],
          id: '3',
          password: 'user',
          profile: {
            img: '',
          },
          blocked: true,
          metadata: {
            lastLogin: null
          }
        },
      ],
    },

    // Content configuration
    content: {
      // Different content types defined
      types: [
        postContentType, 
        productContentType, 
        ProfilePictureContent, 
        LikeContent, 
        MatchContent, 
        MessageContent
      ],
      initialContent: initialContent,
    },
  }
}
