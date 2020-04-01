module.exports = (options) => {
  

  const ADMIN_ROLE = {
    id: 'admin',
    name: 'Administrator'
  }
  
  const USER_ROLE = {
    id: 'user',
    name: 'Authenticated User'
  }


  const postContentType = {
    title: [{
      en: 'Post'
    }, {
      es: 'Artículo'
    }],
    slug: 'post',
    permissions: {
      read: ['public'],
      write: [USER_ROLE.id, ADMIN_ROLE.id],
      delete: [USER_ROLE.id, ADMIN_ROLE.id],
      crossWrite: [ADMIN_ROLE.id],
      crossDelete: [ADMIN_ROLE.id]
    },
    
    fields: [{
      name: 'title',
      type: 'text'
    }, {
      name: 'description',
      type: 'textarea'
    }, {
      name: 'image',
      type: 'img'
    }, {
      name: 'file',
      type: 'file'
    }, {
      name: 'tags',
      type: 'tags'
    }]
  }


  return {
    storage: {
      type: 'firestore',
      credentials: {
        secret: '',
        public: ''
      }
    },
    database: {
      type: 'FIREBASE',
      dbname: 'my-database'
    },
    language: {
      default: 'en',
      available: ['en', 'es', 'de']
    },
    admin: {
      permissions: {
        access: [ADMIN_ROLE.id]
      }
    },
    auth: {
      signup: {
        public: true,
        newUserRoles: [USER_ROLE.id],
      }
    },
    user: {
      roles: [USER_ROLE, ADMIN_ROLE],
      permissions: {
        read: [ADMIN_ROLE.id],
        write: [ADMIN_ROLE.id],
        changeRole: [ADMIN_ROLE.id]
      }
    },
    content: {
      types: [postContentType] 
    },
    tags: {
      initialTags: [{
        slug: 'software',
        label: {
          en: 'Software',
          es: 'Software'
        }
      }, {
        slug: 'ai',
        label: {
          en: 'Artificial Inteligence',
          es: 'Inteligencia Artificial'
        }
      }]

    }
  }
}