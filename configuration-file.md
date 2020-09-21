---
title: Configuration file
description: "Configuration file"
---

# Example configuration file.

Please refer to the Github repository for newer versions.

```javascript
export const getConfig = (defaultOptions) => {
  const userRole = defaultOptions.roles.user.value
  const adminRole = defaultOptions.roles.admin.value
  const publicRole = defaultOptions.roles.public.value

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
        name: 'image',
        type: 'img',
        label: 'Image',
        placeholder: 'Image',
        errorMessage: 'Only images supported'
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

  
 
  return {
    // Title for the site
    title: 'Etereo - Edge',

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
    url: 'https://edge-next.now.sh/',

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
    },

    // Users configuration
    user: {

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
            name: 'description',
            type: 'textarea',
            label: 'Description',
            required: false,
            minlength: 20,
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
            lastLogin: null,
          },
        }],
    },

    // Content configuration
    content: {
      // Different content types defined
      types: [
        postContentType
      ],
      initialContent: []
    },
  }
}
````
