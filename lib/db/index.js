import config from '../config'
import {DATABASES} from '../config-constants/databases'
import { connect as connectInMemoryDB } from './inMemoryDB'
import { connect as connectFirebase } from './firestoreDB'
let db = null

const connectFirebase = () => {
    console.log('Connected')
    return Promise.resolve()
}

const connectMongoDB = () => {
    console.log('Connected to mongo')
    return Promise.resolve()
}

const connectInMemoryDB = () => {
    console.log('Connecting to in memory database...')
    await inMemoryDB.connect()
    console.log('Connection succesful to in memory DB')
}

export function connect() {
  if (config.database.type === DATABASES.FIREBASE) {
      db = connectFirebase(config.firebase)
  } else if (config.database.type === DATABASES.MONGODB) {
      return connectMongoDB(config.mongoDB)
  } else {
      db = connectInMemoryDB()
  }
}

export default db