import { DATABASES } from '../../config/config-constants'
import config from '../../config'
import { connect as connectFirebase } from './firestoreDB'
import { connect as connectInMemoryDB } from './inMemoryDB'
import { connect as connectMongoDB } from './mongoDB'

let db = null

export const getDB = () => {
  return db
}

export const setUpDB = () => {
  // TODO: Maybe only doing it with inMemory db
  if (config.content.initialContent && config.database.type === DATABASES.IN_MEMORY) {
    console.log('Inserting initial database content')

    config.content.initialContent.map((item) => {
      db.collection(item.type).add(item)
    })

    config.user.initialUsers.map((item) => {
      db.collection('users').add(item)
    })

    config.activity.initialActivity.map((item) => {
      db.collection('activity').add(item)
    })
  }
}

export const connect = async() => {
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

