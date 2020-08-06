import { DATABASES } from '@lib/constants'
import config from '../../config'
import { connect as connectFirebase } from './firestoreDB'
import { connect as connectInMemoryDB } from './inMemoryDB'
import { connect as connectMongoDB } from './mongoDB'
import logger from '@lib/logger'
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

  logger('INFO', 'Database seeding')

  if (config.content.initialContent) {
    logger('INFO', 'Inserting initial database content')

    config.content.initialContent.map(async (item) => {
      await db.collection(item.type).add(item)
    })
  }

  if (config.user.initialUsers) {
    logger('INFO', 'Inserting initial users')

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
       logger('INFO', 'Connecting to firebase database')
      db = await connectFirebase()
    } else if (config.database.type === DATABASES.MONGO) {
       logger('INFO', 'Connecting to Mongo Database')
      db = await connectMongoDB()
    } else {
      logger('INFO', 'Using in memory database')
      db = connectInMemoryDB()
    }

    await setUpDB()
  } else {
     logger('INFO', 'Reusing cached db')
  }
}
