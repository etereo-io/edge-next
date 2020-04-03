const data = {
  users: [],
  content: []
}

const getFor = name => {
  return () => {
    return Promise.resolve(data[name] || [])
  }
}

const addFor = name => {
  return (item) => {
    const newItem = {
      id: Math.random() * 1000 + Math.random * 9988 + '-' + Math.random() * 12313 + '-' + Math.random() * 21211,
      ...item
    }

    if(!data[name]) {
      data[name] = []
    }
    data[name].push(newItem)
    return Promise.resolve(newItem)
  }
}


const findFor = name => {
  return (options) => {
    
    return Promise.resolve((data[name] || []).find(i => {
      Object.keys(options).forEach(k => {
        if(options[k] === i[k]) {
          return i
        }
      })
    }))
  }
}

const delFor = name => {
  return (id) => {
    data[name] = (data[name] || []).filter(i => i.id !== id)
  }
}

export function connect() {
  const db = {
    collection: (name) => {
      return {
        get: getFor(name),
        add: addFor(name),
        find: findFor(name),
        del: delFor(name)
      }
    }
  }
  return db
}


