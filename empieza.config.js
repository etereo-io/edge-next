module.exports = (defaultOptions) => {
  

  const postContentType = {
    title: [{
      en: 'Post'
    }, {
      es: 'Artículo'
    }],
    slug: 'post',
    permissions: {
      read: ['public'],
      write: [defaultOptions.roles.admin, defaultOptions.roles.user],
      delete: [defaultOptions.roles.admin],
      crossWrite: [defaultOptions.roles.admin],
      crossDelete: [defaultOptions.roles.admin]
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
    },
    database: {
      type: 'FIREBASE',
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