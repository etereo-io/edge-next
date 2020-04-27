import { MongoClient, ObjectID } from 'mongodb'

import Database from './Database'

const url = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DATABASE

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

class db extends Database {
  constructor(mongoClientInstance) {
    super()
    this.client = mongoClientInstance
    this.db = mongoClientInstance.db(dbName)
    this.limitIndex = 0
    this.startIndex = 0
    this.col = ''
  }

  nativeDriver() {
    return this.db
  }

  add(item) {
    const newItem = {
      _id: ObjectID(),
      ...item,
      createdAt: item.createdAt || Date.now(),
    }

    return new Promise((resolve, reject) => {
      this.db.collection(this.col).insertOne(newItem, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  find({ id, ...options }) {
    console.log('DB - Find', this.col, options)

    if (id) {
      options._id = id
    }

    return new Promise((resolve, reject) => {
      this.db
        .collection(this.col)
        .find(options)
        .skip(this.startIndex)
        .limit(this.limitIndex)
        .toArray((err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(
              result.map((item) => {
                const { _id, ...rest } = item
                return {
                  ...rest,
                  id: _id.toString(),
                }
              })
            )
          }
        })
    })
  }

  findOne(options) {
    console.log('DB - findOne', this.col, options)

    return new Promise((resolve, reject) => {
      this.db.collection(this.col).findOne(options, (err, item) => {
        if (err) {
          reject(err)
        } else {
          if (item) {
            const { _id, ...rest } = item
            resolve({
              ...rest,
              id: _id.toString(),
            })
          } else {
            resolve(null)
          }
        }
      })
    })
  }

  collection(name) {
    this.col = name
    this.limitIndex = 0
    this.startIndex = 0

    return this
  }

  doc(id) {
    return {
      set: (newItemData) => {
        return new Promise((resolve, reject) => {
          this.db
            .collection(this.col)
            .findOneAndUpdate({ _id: id }, newItemData, (err, item) => {
              if (err) {
                reject(err)
              } else {
                if (item) {
                  const { _id, ...rest } = item
                  resolve({
                    ...rest,
                    id: _id.toString(),
                  })
                } else {
                  resolve(null)
                }
              }
            })
        })
      },
    }
  }

  limit(num) {
    this.limitIndex = num * 1
    return this
  }

  start(num) {
    this.startIndex = num * 1

    return this
  }
}

export const connect = async () => {
  if (!client.isConnected()) {
    try {
      await client.connect()
      console.log('Connected correctly to server', dbName)
      return new db(client)
    } catch (err) {
      console.log(err.stack)
    }
  } else {
    return new db(client)
  }
}
