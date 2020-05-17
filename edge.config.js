import crypto from 'crypto'
import randomWords from 'random-words'

function ObjectID(rnd = (r16) => Math.floor(r16).toString(16)) {
  return (
    rnd(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => rnd(Math.random() * 16))
  )
}

const posts = []
const products = []
const comments = []
const initialActivity = []

function generateParagraph() {
  const phrases = []
  const max = Math.round(Math.random() * 5) + 1

  for (var i = 0; i < max; i++) {
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
    draft: Math.random() > 0.5 ? true : false,
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
    image: 'https://loremflickr.com/240/240/food?random=' + i,
    author: userId,
    title: randomWords({ min: 3, max: 10 }).join(' '),
    slug: 'example-product-' + productId,
    draft: Math.random() > 0.5 ? true : false,
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

  const salt = crypto.randomBytes(16).toString('hex')
const hash = crypto.pbkdf2Sync('1234', salt, 1000, 64, 'sha512').toString('hex')

const initialUsers = [{
  username: 'admin',
  displayname: 'The admin',
  email: 'admin@demo.com', 
  emailVerified: true,
  createdAt: Date.now(),
  roles: [adminRole, userRole],
  id: ObjectID(),
  salt,
  hash,
  profile: {
    picture: '/static/demo-images/default-avatar.jpg',
  },
  metadata: {
    lastLogin: null,
  },
},
{
  username: 'user',
  email: 'user@demo.com',
  emailVerified: true,
  createdAt: Date.now(),
  roles: [userRole],
  id: userId,
  salt,
  hash,
  profile: {
    picture: '',
  },
  metadata: {
    lastLogin: null,
  },
},
{
  username: 'blocked',
  email: 'blocked@demo.com',
  emailVerified: true,
  createdAt: Date.now(),
  roles: [userRole],
  id: ObjectID(),
  salt,
  hash,
  profile: {
    picture: '',
  },
  blocked: true,
  metadata: {
    lastLogin: null,
  },
},
{
  username: 'notverified',
  email: 'notverified@demo.com',
  emailVerified: false,
  emailVerificationToken: '1234',
  createdAt: Date.now(),
  roles: [userRole],
  id: ObjectID(),
  salt,
  hash,
  profile: {
    picture: '',
  },
  blocked: true,
  metadata: {
    lastLogin: null,
  },
}]

  const postContentType = {
    title: 'Post',

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
      title: 'title',
    },

    monetization: {
      web: true
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
        maxlength: 150,
        errorMessage: 'Title must be between 8 and 150 characters'
      },
      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        minlength: 20,
        maxlength: 2000,
        errorMessage: 'Description must be between 20 and 2000 characters'
      },
      {
        name: 'images',
        type: 'img',
        label: 'Images',
        placeholder: 'Images',
        multiple: true,
        errorMessage: 'Only images supported'
      },
      {
        name: 'video',
        type: 'video_url',
        label: 'Video (URL)',
        errorMessage: 'Only urls (https://) are supported'
      },
      {
        name: 'file',
        type: 'file',
        label: 'File',
        placeholder: 'File',
        errorMessage: 'File size must be less than 3MB'
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags',
      },
    ],
  }

  
  const dishContentType = {
    title: 'dish',

    slug: 'dish',

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
      title: 'title',
    },

    comments: {
      enabled: false,
    },

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 8,
        maxlength: 150,
        errorMessage: 'Title must be between 8 and 150 characters'
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
        minlength: 20,
        maxlength: 2000,
        errorMessage: 'Description must be between 20 and 2000 characters'
      },
      {
        name: 'ingredients',
        type: 'textarea',
        label: 'Ingredients',
        placeholder: 'Ingredients',
        minlength: 20,
        maxlength: 2000,
        errorMessage: 'Ingredients must be between 20 and 2000 characters'
      },
      {
        name: 'images',
        type: 'img',
        label: 'Images',
        placeholder: 'Images',
        multiple: true,
        errorMessage: 'Only images supported'
      },
      {
        name: 'price',
        type: 'number',
        label: 'Price',
        placeholder: 'Price',
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
    title: 'Product',

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
      title: 'title',
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
        maxlength: 200,
        errorMessage: 'Title must be between 10 and 200 characters'
      },
      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        minlength: 10,
        maxlength: 2000,
        errorMessage: ''
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
        maxlength: 200,
      },
      {
        name: 'price',
        type: 'number',
        label: 'Price',
        placeholder: 'Price',
        min: 0,
        max: 100000,
      },
      {
        name: 'stockamount',
        type: 'number',
        label: 'Stock Amount',
        placeholder: 'Stock Amount',
        private: true,
      },
    ],
  }

  return {
    // Title for the site
    title: 'Nucleo - Edge',

    // Meta description
    description: 'A dynamic site that lives on the edge',

    // Home slogan
    slogan: 'EDGE - OpenSource software for quickstarting your ideas',

    // Api
    api : {
      bodyParser: {
        sizeLimit: '1mb'
      }
    },

    // Storages: GOOGLE, AWS, FIREBASE
    storage: {
      type: 'GOOGLE',
    },

    // Choose from MONGO, IN_MEMORY
    database: {
      type: 'MONGO',
    },

    // Used for e-mails and links
    url: 'https://edge-next.now.sh',

    emails: {
      from: 'no-reply@edge-next.io',
      contact: 'contact@edge-next.io',
    },

    // Themes
    theme: {
      default: 'light-theme',
      themes: [
        {
          label: 'Light',
          value: 'light-theme',
          mainColor: 'white',
          borderColor: 'black',
        },
        {
          label: 'Dark',
          value: 'dark-theme',
          mainColor: 'black',
          borderColor: 'white',
        },
        {
          label: 'Robot',
          value: 'robot-theme',
          mainColor: 'black',
          borderColor: 'green',
        },
        {
          label: 'Kawaii',
          value: 'kawaii-theme',
          mainColor: 'pink',
          borderColor: 'black',
        },
      ],
    },

    // Add one more role
    // TODO: see how to use them
    roles: {
      ...defaultOptions.roles,
      shopOwner: {
        label: 'Shop Owner',
        value: shopOwnerRole,
      },
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
        github: true,
        google: true,
        facebook: true,
      },

      // Fields for the users profiles (in addition to picture and displayName)
      profile: {
        fields: [
          {
            name: 'bio',
            type: 'textarea',
            label: 'Bio',
            required: false,
            minlength: 60,
            maxlength: 300,
          },
          {
            name: 'twitter',
            type: 'text',
            label: 'twitter',
            required: false,
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'facebook',
            type: 'text',
            label: 'facebook',
            required: false,
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'github',
            type: 'text',
            label: 'github',
            required: false,
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'gender',
            type: 'select',
            label: 'gender',
            required: true,
            options: [
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
            ],
          },
        ],
      },

      // Initial users data for testing purposes
      initialUsers: initialUsers,
    },

    // Content configuration
    content: {
      // Different content types defined
      types: [
        postContentType,
        productContentType,
        dishContentType,
        // recipeContentType,
        // videoTutorialContentType,
      ],
      initialContent: initialContent,
    },
  }
}
