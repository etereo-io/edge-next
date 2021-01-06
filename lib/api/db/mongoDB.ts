import { Db, MongoClient, ObjectID } from 'mongodb'

import Database from './Database'
import logger from '@lib/logger'

class MongoDB extends Database {
  col: string
  limitIndex: number
  startIndex: number
  db: Db
  isConnected: boolean

  constructor(private readonly client: MongoClient) {
    super()
    this.limitIndex = 0
    this.startIndex = 0
    this.isConnected = false
    this.col = ''
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect()

      this.db = client.db(dbName)
    }
  }

  async setUpDb() {
    await this.db
      .collection('tokens')
      .createIndex('expireAt', { expireAfterSeconds: 0 })
  }

  add(item) {
    const newItem = {
      _id: new ObjectID(),
      ...item,
      createdAt: item.createdAt || Date.now(),
      updatedAt: Date.now()
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

  aggregation(options) {
   return  this.db.collection(this.col).aggregate(options)
  }

  find(
    { id, ...options },
    otherOptions = { sortBy: 'createdAt', sortOrder: 'DESC' }
  ) {
    logger('DEBUG', 'DB - Find', this.col, options)

    return new Promise((resolve, reject) => {
      const sort = {}
      try {
        if (id) {
          if(id.$in) {
            options._id = {$in: id.$in.map(itemId => new ObjectID(itemId))}
          } else {
            options._id = new ObjectID(id)
          }

        }
        sort[otherOptions.sortBy || 'createdAt'] =
          otherOptions.sortOrder === 'DESC' ? -1 : 1
      } catch (err) {
        reject(err)
      }

      const { sortBy, sortOrder, ...otherFindOptions } = otherOptions

      this.db
        .collection(this.col)
        .find(options, otherFindOptions)
        .sort(sort)
        .skip(this.startIndex)
        .limit(this.limitIndex)
        .toArray((err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(
              result.map(({ _id, ...rest }) => ({
                ...rest,
                id: _id.toString(),
              }))
            )
          }
        })
    })
  }

  findOne({ id, ...options }) {
    logger('DEBUG', 'DB - findOne', this.col, options)

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
        logger('DEBUG', 'DB - set', this.col, id)

        return new Promise((resolve, reject) => {
          this.db.collection(this.col).findOneAndUpdate(
            { _id: new ObjectID(id) },
            {
              $set: {
                ...newItemData,
                updatedAt: Date.now(),
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
        logger('DEBUG', 'DB - findOne', this.col, id)

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

  async remove({ id, ...options }, onlyOne = false) {
    if (!id && Object.keys(options).length === 0) {
      return Promise.reject('Can not delete entire collection')
    }
    if (id) {
      options._id = new ObjectID(id)
    }
    return new Promise((resolve, reject) => {
      this.db
        .collection(this.col)
        .remove(options, { single: onlyOne }, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
    })
  }
}

const dbName = process.env.MONGODB_DATABASE

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const instance = new MongoDB(client)

export const connect = async () => {
  if (!instance.isConnected) {
    try {
      await instance.connect()
      await instance.setUpDb()

      logger('DEBUG', 'Connected correctly to server', dbName)
    } catch (err) {
      logger('ERROR', err.stack)
    }
  }

  return instance
}
