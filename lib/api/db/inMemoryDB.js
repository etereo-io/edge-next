import { v4 as uuidv4 } from 'uuid';

const data = {
  users: [],
  content: [],
  comments: [],
}

class db {
  constructor() {
    this.col = ''
    this.limitIndex = 0
    this.startIndex = 0
  }

  get() {
    return Promise.resolve(data[this.col] || [])
  }

  add(item) {
    const newItem = {
      id: item.id || uuidv4(),
      ...item,
    }

    if (!data[this.col]) {
      data[this.col] = []
    }
    data[this.col].push(newItem)
    return Promise.resolve(newItem)
  }

  find(options) {
    console.log('DB - Find', this.col, options)

    return new Promise((resolve) => {
      const itemsFound = (data[this.col] || []).filter((i) => {
        return (
          Object.keys(options)
            .filter((k) => typeof options[k] !== 'undefined')
            .reduce((prev, k) => {
              return prev && options[k] == i[k]
            }, true) 
        )
      })
      .filter((i, index) => {
        // Apply limit and start filters
        return index >= this.startIndex &&
        (this.limitIndex ? index <= this.limitIndex + this.startIndex : true)
      })

      resolve(itemsFound)
    })
  }

  findOne(options) {
    return this.find(options).then((result) => {
      return result[0]
    })
  }

  del(id) {
    data[this.col] = (data[this.col] || []).filter((i) => i.id !== id)
  }

  collection(name) {
    this.col = name
    this.limitIndeX = 0
    this.startIndex = 0

    return this
  }

  doc(id) {
    
    return {
      set: (newItemData) => {
        return this.findOne({
          id: id
        })
        .then(item => {
          if (!item) {
            throw 'Not found'
            return
          }
          const newItem = {
            ...item, ...newItemData
          }
          data[this.col] = [...(data[this.col].filter(i => i.id !== item.id)), newItem]

          return newItem
        })

       
      }
    }
  }

  limit(num) {
    this.limitIndex = num * 1
    return this
  }

  start(num) {
    this.startIndex = num *1

    return this
  }
}

export function connect() {
  const instanceDb = new db()
  return instanceDb
}
