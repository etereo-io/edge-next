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
      delete: [USER_ROLE.id],
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
    }]
  }


  return {
    firebase: {
      secret: '',
      public: ''
    },
    language: options.languages.EN,
    availableLanguages: [options.languages.EN, options.languages.ES],
    auth: {
      allowRegister: true,
      newUserRoles: [USER_ROLE.id],
    },
    users: {
      roles: [USER_ROLE, ADMIN_ROLE],
      permissions: {
        read: [ADMIN_ROLE.id],
        write: [ADMIN_ROLE.id],
        change_role: [ADMIN_ROLE.id]
      }
    },
    contentTypes: [postContentType],
  }
}