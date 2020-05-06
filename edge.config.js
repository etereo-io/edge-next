import randomWords from 'random-words'

function ObjectID(rnd = r16 => Math.floor(r16).toString(16)) {
  return  rnd(Date.now()/1000) + ' '.repeat(16).replace(/./g, () => rnd(Math.random()*16));
}

const posts = []
const products = []
const comments = []
const initialActivity = []

function generateParagraph() {
  const phrases = []
  const max = Math.round(Math.random() * 5) + 1

  for(var i = 0; i < max; i++) {
    phrases.push(randomWords({ min: 5, max: 50 }).join(' '))
  }

  return phrases.join('\n')
}

const userId = ObjectID()

for (var i = 0; i < 30; i++) {
  const postId = ObjectID()
  const productId = ObjectID()

  posts.push({
    type: 'post',
    id: postId,
    author: userId,
    title: randomWords({ min: 3, max: 10 }).join(' '),
    slug: 'example-post-' + postId,
    image: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    description: generateParagraph(),
    draft: Math.random() > 0.5 ? true: false,
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
    id: productId,
    image: 'https://loremflickr.com/240/240/food?random='+i,
    author: userId,
    title: randomWords({ min: 3, max: 10 }).join(' '),
    slug: 'example-product-' + productId,
    draft: Math.random() > 0.5 ? true: false,
    description: generateParagraph(),
  })

  initialActivity.push({
    author: userId,
    type: 'content_added',
    meta: {
      contentTitle: 'Example post', // This will not work with dynamic fields
      contentType: 'post',
      contentId: postId,
    },
  })

  initialActivity.push({
    author: userId,
    type: 'content_added',
    meta: {
      contentTitle: 'Example product', // This will not work with dynamic fields
      contentType: 'product',
      contentId: productId,
    },
  })

  for (var j = 0; j < 20; j++) {
    comments.push({
      type: 'comment',
      contentType: 'post',
      contentId: postId,
      message: generateParagraph(),
      author: userId,
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
  const userRole = defaultOptions.roles.user.value
  const adminRole = defaultOptions.roles.admin.value
  const shopOwnerRole = 'SHOP_OWNER'
  const publicRole = defaultOptions.roles.public.value

  const postContentType = {
    title: {
      en: 'Post',
      es: 'Artículo',
    },

    slug: 'post',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: [publicRole],
      create: [adminRole, userRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    publishing: {
      draftMode: true,
      title: 'title'
    },

    comments: {
      enabled: true,
      permissions: {
        read: [publicRole],
        create: [userRole, adminRole],
        update: [adminRole],
        delete: [adminRole],
        admin: [adminRole],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 8,
        maxlength: 150
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
        minlength: 20,
        maxlength: 2000
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
        name: 'video',
        type: 'video_url',
        label: 'Video',
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags',
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

    publishing: {
      draftMode: false
    },

    permissions: {
      read: [userRole, adminRole],
      create: [adminRole, userRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
      report: [userRole],
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
      read: [userRole, adminRole],
      create: [adminRole, userRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
      report: [userRole],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    publishing: {
      draftMode: false
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
      read: [userRole, adminRole],
      create: [adminRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    comments: {
      enabled: false,
      permissions: {}
    },

    publishing: {
      draftMode: false
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
      read: [userRole, adminRole],
      create: [adminRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    publishing: {
      draftMode: false
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
      read: [publicRole],
      create: [adminRole, shopOwnerRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    publishing: {
      draftMode: true,
      title: 'title'
    },

    display: 'grid',

    comments: {
      enabled: false,
      permissions: {
        read: [publicRole],
        create: [userRole, adminRole],
        update: [adminRole, userRole],
        delete: [adminRole],
        admin: [adminRole],
      },
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 10,
        maxlength: 200
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
        minlength: 10,
        maxlength: 2000
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
        maxlength: 200
      },
      {
        name: 'price',
        type: 'number',
        label: 'Price',
        placeholder: 'Price',
        min: 0,
        max: 100000
      },
      {
        name: 'stockamount',
        type: 'number',
        label: 'Stock Amount',
        placeholder: 'Stock Amount',
        private: true
      },
    ],
  }

  return {
    // Title for the site
    title: 'Nucleo - Edge',

    // Meta description
    description: 'A dynamic site that lives on the edge',

    // Home slogan
    slogan: 'EDGE - A dynamic site that lives on the edge',

    storage: {
      type: 'firestore',
    },

    // Choose from MONGO, FIREBASE, IN_MEMORY
    database: {
      type: 'MONGO',
    },

    // Used for e-mails and links
    url: 'https://edge-next.now.sh/',
    
    emails: {
      from: 'no-reply@edge-next.io',
      contact: 'contact@edge-next.io'
    },

    // Themes
    theme: {
      default: 'light-theme',
      themes:  [
        {
          label: 'Light',
          value: 'light-theme',
          mainColor: 'white',
          borderColor: 'black'
        },
        {
          label: 'Dark',
          value: 'dark-theme',
          mainColor: 'black',
          borderColor: 'white'
        },
        {
          label: 'Robot',
          value: 'robot-theme',
          mainColor: 'black',
          borderColor: 'green'
        },
        {
          label: 'Kawaii',
          value: 'kawaii-theme',
          mainColor: 'pink',
          borderColor: 'black'
        },
      ]
    },

    // Add one more role
    roles: {
      ...defaultOptions.roles,
      shopOwner: {
        label: 'Shop Owner',
        value: shopOwnerRole
      }
    },

    // Users activity logging & API
    activity: {

      // Enables Activity API and stores content, comment and user activities,
      enabled: true, 
      permissions: {
        content: {
          created: [publicRole],
          deleted: [adminRole],
          edited: [adminRole],
        },
        comments: {
          created: [publicRole],
          deleted: [adminRole],
          edited: [adminRole],
        },
        users: {
          created: [adminRole],
          deleted: [adminRole],
          edited: [adminRole],
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

      providers: {
        instagram: false,
        google: false,
        facebook: true
      },

      // Fields for the users profiles (in addition to picture and displayName)
      profile: {
        fields: [{
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          minlength: 60,
          maxlength: 300,
          roles: []
        }, {
          name: 'gender',
          type: 'select',
          label: 'gender',
          required: true,
          options: [{
            label: 'Male',
            value: 'male'
          },{
            label: 'Female',
            value: 'female'
          }]
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
          roles: [adminRole, userRole],
          id: ObjectID(),
          password: 'admin',
          profile: {
            picture: '/static/demo-images/default-avatar.jpg',
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
          roles: [userRole],
          id: userId,
          password: 'user',
          profile: {
            picture: '',
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
          roles: [userRole],
          id: ObjectID(),
          password: 'user',
          profile: {
            picture: '',
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
          roles: [userRole],
          id: ObjectID(),
          password: 'user',
          profile: {
            picture: '',
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
