const data = {
  users: [],
  content: [],
  comments: []
}

class db {
  constructor() {
    this.col = ''
    this.doc = ''
    this.limitIndex = 0
    this.startIndex = 0
  }

  get() {
    return Promise.resolve(data[this.col] || [])
  }

  add (item){
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

    if (!data[this.col]) {
      data[this.col] = []
    }
    data[this.col].push(newItem)
    return Promise.resolve(newItem)
  }

  find(options) {

    console.log('DB - Find', this.col, options)

    return new Promise((resolve) => {
      const itemsFound = (data[this.col] || []).filter((i, index) => {
        return Object.keys(options).filter(k => typeof options[k] !== 'undefined').reduce((prev, k) => {
          return prev &&  (options[k] === i[k]) 
        }, true) && index >= this.startIndex && (this.limitIndex ? index <= this.limitIndex + this.startIndex : true)
      })

      resolve(itemsFound)
    })

  }

  findOne(options) {
    return this.find(options)
      .then(result => {
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

  limit(num) {
    this.limitIndex  = num
    return this
  }

  start(num) {
    this.startIndex = num

    return this
  }
}

export function connect() {
  const instanceDb = new db()
  return instanceDb
}
