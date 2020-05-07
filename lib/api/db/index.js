import { DATABASES } from '../../config/config-constants'
import config from '../../config'
import { connect as connectFirebase } from './firestoreDB'
import { connect as connectInMemoryDB } from './inMemoryDB'
import { connect as connectMongoDB } from './mongoDB'

let seeded = null
let db = null

export const getDB = () => {
  return db
}

export const setUpDB = async () => {
  const hasBeenSeeded = await db.collection('config').findOne({
    seed: true,
  })

  if (hasBeenSeeded || seeded) {
    return
  }

  seeded = true

  await db.collection('config').add({
    seed: true,
  })

  console.log('Database seeding')

  if (config.content.initialContent) {
    console.log('Inserting initial database content')

    config.content.initialContent.map(async (item) => {
      await db.collection(item.type).add(item)
    })
  }

  if (config.user.initialUsers) {
    console.log('Inserting initial users')

    config.user.initialUsers.map(async (item) => {
      await db.collection('users').add(item)
    })

    config.activity.initialActivity.map(async (item) => {
      await db.collection('activity').add(item)
    })
  }
}

export const connect = async () => {
  if (!db) {
    if (config.database.type === DATABASES.FIREBASE) {
      console.log('Connecting to firebase database')
      db = connectFirebase()
    } else if (config.database.type === DATABASES.MONGO) {
      console.log('Connecting to Mongo Database')
      db = await connectMongoDB()
    } else {
      console.log('Using in memory database')
      db = connectInMemoryDB()
    }
  }

  await setUpDB()
}
