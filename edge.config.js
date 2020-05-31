import crypto from 'crypto'

function ObjectID(rnd = (r16) => Math.floor(r16).toString(16)) {
  return (
    rnd(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => rnd(Math.random() * 16))
  )
}

export const getConfig = (defaultOptions) => {
  const userRole = defaultOptions.roles.user.value
  const adminRole = defaultOptions.roles.admin.value
  const publicRole = defaultOptions.roles.public.value

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync('1234', salt, 1000, 64, 'sha512')
    .toString('hex')

  const initialUsers = [
    {
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
        picture: {
          path: '/static/demo-images/default-avatar.jpg',
        },
      },
      metadata: {
        lastLogin: null,
      },
    },
  ]

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
      web: true,
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
        errorMessage: 'Title must be between 8 and 150 characters',
      },
      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        minlength: 20,
        maxlength: 2000,
        description: 'Markdown supported.',
        errorMessage: 'Description must be between 20 and 2000 characters',
      },
      {
        name: 'images',
        type: 'img',
        label: 'Images',
        placeholder: 'Images',
        multiple: true,
        errorMessage: 'Only images supported',
      },
      {
        name: 'video',
        type: 'video_url',
        label: 'Video (URL)',
        errorMessage: 'Only urls (https://) are supported',
      },
      {
        name: 'file',
        type: 'file',
        label: 'File',
        placeholder: 'File',
        errorMessage: 'File size must be less than 3MB',
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
        placeholder: 'Tags',
      },
      {
        name: 'paymentPointer',
        type: 'text',
        label: 'Payment Pointer',
        placeholder: 'Web monetization payment pointer',
        hidden: true,
        description:
          'Add your web monetization payment pointer to make this content private, and only accesible by web monetization',
      },
    ],
  }

  const siteNewsContentType = {
    title: 'Site news',

    slug: 'site-news',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: [publicRole],
      create: [adminRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    publishing: {
      draftMode: true,
      title: 'title',
    },

    comments: {
      enabled: true,
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
        errorMessage: 'Title must be between 10 and 200 characters',
      },

      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        minlength: 10,
        errorMessage: '',
      },
      {
        name: 'severity',
        type: 'radio',
        label: 'News severity',
        showLabel: true,
        options: [
          {
            label: 'Weak',
            value: 'weak',
          },
          {
            label: 'Medium',
            value: 'Medium',
          },
          {
            label: 'High',
            value: 'high',
          },
        ],
      },

      {
        name: 'affects',
        type: 'radio',
        multiple: true,
        label: 'Affects to systems',
        showLabel: true,
        options: [
          {
            label: 'Content Api',
            value: 'content-api',
          },
          {
            label: 'Users API',
            value: 'users-api',
          },
          {
            label: 'Auth API',
            value: 'auth-api',
          },
          {
            label: 'Website',
            value: 'website',
          },
        ],
      },
      {
        name: 'tags',
        type: 'tags',
        label: 'Tags',
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
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
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
      initialActivity: [],
    },

    // Users configuration
    user: {
      // Capture user geolocation and enable geolocation display on the admin dashboard
      captureGeolocation: false,

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
            minlength: 20,
            maxlength: 300,
          },
          {
            name: 'twitter',
            type: 'url',
            label: 'twitter',
            pattern: 'https?://.*',
            required: false,
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'facebook',
            type: 'url',
            label: 'facebook',
            required: false,
            pattern: 'https?://.*',
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'github',
            type: 'url',
            label: 'github',
            required: false,
            pattern: 'https?://.*',
            minlength: 10,
            maxlength: 300,
          },
          {
            name: 'date',
            type: 'date',
            label: 'Birth date',
            required: false,
          },
          {
            name: 'phone',
            type: 'tel',
            label: 'Your phone',
          },
          {
            name: 'profile-images',
            type: 'img',
            label: 'Profile Images',
            required: false,
            multiple: true,
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
      types: [postContentType, siteNewsContentType],
      initialContent: [],
    },

    // Features not implemented yet, but UI implemented
    like: {
      enabled: false,
    },
    follow: {
      enabled: false,
    },
  }
}
