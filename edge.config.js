import crypto from 'crypto'

function ObjectID(rnd = (r16) => Math.floor(r16).toString(16)) {
  return (
    rnd(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => rnd(Math.random() * 16))
  )
}

export const getConfig = () => {
  const userRole = 'USER'
  const adminRole = 'ADMIN'
  const publicRole = 'PUBLIC'

  const roles = [
    {
      label: 'Administrator',
      value: adminRole,
    },
    {
      label: 'User',
      value: userRole,
    },
    {
      label: 'Public',
      value: publicRole,
    },
  ]

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

    methods: {
      get: true,
      post: true,
      delete: true,
      put: true,
    },

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

    entityInteractions: [
      {
        type: 'like',
        aggregation: 'sum',
        icon: 'like',
        activeTitle: 'Like',
        inactiveTitle: 'Unlike',
        permissions: {
          read: ['PUBLIC', 'USER'],
          create: ['USER'],
          delete: ['USER'],
        },
      },
      {
        type: 'follow',
        icon: 'follow',
        activeTitle: 'Follow',
        inactiveTitle: 'Unfollow',
        permissions: {
          read: ['PUBLIC', 'USER'],
          create: ['USER'],
          delete: ['USER'],
        },
      },
      {
        type: 'report',
        activeTitle: 'Report',
        inactiveTitle: 'Report',
        permissions: {
          read: ['PUBLIC', 'USER'],
          create: ['USER'],
          delete: ['USER'],
        },
      },
      {
        type: 'favorite',
        aggregation: 'sum',
        activeTitle: 'Remove from favorite',
        inactiveTitle: 'Add to favorite',
        icon: 'favorite',
        permissions: {
          read: ['PUBLIC', 'USER'],
          create: ['USER'],
          delete: ['USER'],
        },
      },
    ],

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 8,
        maxlength: 150,
        required: true,
        errorMessage: 'Title must be between 8 and 150 characters',
      },
      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        minlength: 20,
        required: true,
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
      {
        name: 'markdown',
        type: 'rich_text',
        label: 'Markdown',
        placeholder: 'Markdown',
        required: true,
        errorMessage: 'Text is required',
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
        required: true,
        maxlength: 200,
        errorMessage: 'Title must be between 10 and 200 characters',
      },

      {
        name: 'description',
        type: 'markdown',
        label: 'Description',
        placeholder: 'Description',
        required: true,
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

  const publishingGroupType = {
    title: 'Publishing Group',

    slug: 'publishing-group',

    slugGeneration: ['title', 'createdAt'],

    permissions: {
      read: [publicRole],
      create: [adminRole, userRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
    },

    roles: [
      {
        label: 'Group Member',
        value: 'GROUP_MEMBER',
      },
      {
        label: 'Group admin',
        value: 'GROUP_ADMIN',
      },
    ],

    publishing: {
      draftMode: true,
      title: 'title',
    },

    user: {
      requireApproval: true, // Default require approval or not
      permissions: {
        read: ['GROUP_MEMBER'],
        join: [userRole],
        create: ['GROUP_ADMIN', adminRole],
        update: ['GROUP_ADMIN', adminRole],
        delete: ['GROUP_ADMIN', adminRole],
        admin: ['GROUP_ADMIN', adminRole],
      },
    },

    contentTypes: [
      {
        slug: 'post',
        permissions: {
          read: ['GROUP_MEMBER'],
          create: ['GROUP_MEMBER'],
          update: ['GROUP_ADMIN'],
          delete: ['GROUP_ADMIN'],
          admin: ['GROUP_ADMIN'],
        },
      },
      {
        slug: 'site-news',
        permissions: {
          read: ['GROUP_MEMBER'],
          create: ['GROUP_MEMBER'],
          update: ['GROUP_ADMIN'],
          delete: ['GROUP_ADMIN'],
          admin: ['GROUP_ADMIN'],
        },
      },
    ],

    entityInteractions: [
      {
        type: 'like',
        aggregation: 'sum',
        icon: 'like',
        activeTitle: 'Like',
        inactiveTitle: 'Unlike',
        permissions: {
          read: ['USER'],
          create: ['ADMIN'],
          delete: ['USER'],
        },
      },
    ],

    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
        placeholder: 'Title',
        minlength: 8,
        maxlength: 150,
        required: true,
        errorMessage: 'Title must be between 8 and 150 characters',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Description',
        minlength: 1,
        maxlength: 200,
        required: true,
        description:
          'Tell the world something about this publication group (max 200 characters)',
      },
    ],
  }
  // Users configuration
  const user = {
    // Capture user geolocation and enable geolocation display on the admin dashboard
    captureGeolocation: false,

    // Require email verification
    emailVerification: true,

    providers: {
      github: true,
      google: true,
      facebook: true,
    },

    // General roles
    roles: roles,

    // New user roles
    newUserRoles: [userRole],

    permissions: {
      read: [publicRole],
      create: [publicRole],
      update: [adminRole],
      delete: [adminRole],
      admin: [adminRole],
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
    initialUsers,
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

    logger: {
      level: 'ERROR',
    },

    // Storages: GOOGLE, AWS, FIREBASE, AZURE
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
        read: [publicRole],
        create: [adminRole],
        update: [adminRole],
        delete: [adminRole],
        admin: [adminRole],
      },
      initialActivity: [],
    },

    admin: {
      permissions: {
        access: [adminRole],
        stats: [adminRole],
      },
    },

    user,

    // Content configuration
    content: {
      // Different content types defined
      types: [postContentType, siteNewsContentType],
      initialContent: [],
    },

    // Groups definitions
    groups: {
      types: [publishingGroupType],
    },

    // Features not implemented yet, but UI implemented
    like: {
      enabled: false,
    },
    follow: {
      enabled: false,
    },

    // super search configuration
    superSearch: {
      enabled: true,
      permissions: { read: [publicRole] }, // who can use search
      entities: [
        {
          name: 'users', // a collection by which the search will be run
          type: 'user', // used for separation purposes
          fields: ['username'], // fields by which the search will be run
          fieldsForShow: ['username', 'id'], // fields that will be retrieved from the db
          permissions: user.permissions.read, // permissions for check before search
        },
        {
          name: publishingGroupType.slug, // a collection by which the search will be run
          type: 'group', // used for separation purposes
          fields: ['title', 'description'], // fields by which the search will be run
          fieldsForShow: ['title', 'description', 'slug', 'type'], // fields that will be retrieved from the db
          permissions: publishingGroupType.permissions.read, // permissions for check before search
        },
        {
          name: postContentType.slug, // a collection by which the search will be run
          type: 'content', // used for separation purposes
          fields: ['title', 'description'], // fields by which the search will be run
          fieldsForShow: ['title', 'slug', 'description', 'groupId', 'groupType', 'type'], // fields that will be retrieved from the db
          permissions: postContentType.permissions.read, // permissions for check before search
        },
        {
          name: siteNewsContentType.slug, // a collection by which the search will be run
          type: 'content', // used for separation purposes
          fields: ['title', 'description'], // fields by which the search will be run
          fieldsForShow: ['title', 'slug', 'description', 'groupId', 'groupType', 'type'], // fields that will be retrieved from the db
          permissions: siteNewsContentType.permissions.read, // permissions for check before search
        },
      ],
    },
  }
}
