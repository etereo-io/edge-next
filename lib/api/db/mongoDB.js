import { MongoClient, ObjectID } from 'mongodb'

import Database from './Database'

const url = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DATABASE

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let mongoDbInstance = null

export async function setUpDb(db) {
  await db
    .collection('tokens')
    .createIndex('expireAt', { expireAfterSeconds: 0 })
}

class db extends Database {
  constructor() {
    super()
    this.db = mongoDbInstance
    this.limitIndex = 0
    this.startIndex = 0
    this.col = ''
  }

  add(item) {
    const newItem = {
      _id: ObjectID(),
      ...item,
      createdAt: item.createdAt || Date.now(),
    }

    return new Promise((resolve, reject) => {
      this.db.collection(this.col).insertOne(newItem, (err, response) => {
        if (err) {
          reject(err)
        } else {
          const { _id, ...rest } = response.ops[0]
          resolve({
            ...rest,
            id: _id.toString(),
          })
        }
      })
    })
  }

  count(options) {
    return new Promise((resolve, reject) => {
      this.db
        .collection(this.col)
        .find(options)
        .count((err, count) => {
          if (err) {
            reject(err)
          } else {
            resolve(count)
          }
        })
    })
  }

  find(
    { id, ...options },
    sortOptions = { sortBy: 'createdAt', sortOrder: 'DESC' }
  ) {
    console.log('DB - Find', this.col, options)

    return new Promise((resolve, reject) => {
      const sort = {}
      try {
        if (id) {
          options._id = new ObjectID(id)
        }
        sort[sortOptions.sortBy || 'createdAt'] =
          sortOptions.sortOrder === 'DESC' ? -1 : 1
      } catch (err) {
        reject(err)
      }

      this.db
        .collection(this.col)
        .find(options)
        .sort(sort)
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

  findOne({ id, ...options }) {
    console.log('DB - findOne', this.col, options)

    return new Promise((resolve, reject) => {
      try {
        if (id) {
          options._id = new ObjectID(id)
        }
      } catch (err) {
        reject(err)
      }

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
          this.db.collection(this.col).findOneAndUpdate(
            { _id: new ObjectID(id) },
            {
              $set: {
                ...newItemData,
              },
            },
            { returnOriginal: false },
            (err, doc) => {
              if (err) {
                reject(err)
              } else {
                if (doc && doc.value) {
                  const { _id, ...rest } = doc.value
                  resolve({
                    ...rest,
                    id: _id.toString(),
                  })
                } else {
                  resolve(null)
                }
              }
            }
          )
        })
      },
      get: () => {
        return new Promise((resolve, reject) => {
          this.db
            .collection(this.col)
            .findOne({ _id: new ObjectID(id) }, (err, doc) => {
              if (err) {
                reject(err)
              } else {
                if (doc && doc.value) {
                  const { _id, ...rest } = doc.value
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

  remove({ id, ...options }, onlyOne = false) {
    if (!id && Object.keys(options).length === 0) {
      return Promise.reject('Can not delete entire collection')
    }
    if (id) {
      options._id = new ObjectID(id)
    }
    return new Promise((resolve, reject) => {
      this.db.collection(this.col).remove(options, onlyOne, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

export const connect = async () => {
  if (!client.isConnected()) {
    try {
      await client.connect()
      console.log('Connected correctly to server', dbName)
      mongoDbInstance = client.db(dbName)
      await setUpDb(mongoDbInstance)
      return new db()
    } catch (err) {
      console.log(err.stack)
    }
  } else {
    // console.log('Using cached mongo')
    return new db()
  }
}
