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
    firebase: {
      secret: '',
      public: ''
    },
    language: options.languages.en,
    availableLanguages: [options.languages.en, options.languages.es],
    auth: {
      allowRegister: true,
      newUserRoles: [USER_ROLE.id],
    },
    users: {
      roles: [USER_ROLE, ADMIN_ROLE],
      permissions: {
        read: [ADMIN_ROLE.id],
        write: [ADMIN_ROLE.id],
        changeRole: [ADMIN_ROLE.id]
      }
    },
    contentTypes: [postContentType],
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