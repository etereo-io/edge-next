const data = {
  users: [],
  content: [],
  comments: []
}

const getFor = (name) => {
  return () => {
    return Promise.resolve(data[name] || [])
  }
}

const addFor = (name) => {
  return (item) => {
    const newItem = {
      id:
        Math.random() * 1000 +
        Math.random * 9988 +
        '-' +
        Math.random() * 12313 +
        '-' +
        Math.random() * 21211,
      ...item,
    }

    if (!data[name]) {
      data[name] = []
    }
    data[name].push(newItem)
    return Promise.resolve(newItem)
  }
}

const findFor = (name) => {
  return (options) => {

    console.log('DB - Find', name, options)

    return new Promise((resolve) => {
      const itemsFound = (data[name] || []).filter((i) => {
        return Object.keys(options).filter(k => typeof options[k] !== 'undefined').reduce((prev, k) => {
          return prev &&  (options[k] === i[k]) 
        }, true)
      })

      resolve(itemsFound)
    })

  }
}

const findOneFor = (name) => {
  return (options) => {
    
    return findFor(name)(options)
      .then(result => {
        return result[0]
      })
  } 
}

const delFor = (name) => {
  return (id) => {
    data[name] = (data[name] || []).filter((i) => i.id !== id)
  }
}

export function connect() {
  const db = {
    collection: (name) => {
      return {
        get: getFor(name),
        add: addFor(name),
        find: findFor(name),
        findOne: findOneFor(name),
        del: delFor(name),
      }
    },
  }
  return db
}
