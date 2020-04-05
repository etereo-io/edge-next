import config from '../../config'
import { DATABASES } from '../../config/config-constants'
import { connect as connectInMemoryDB } from './inMemoryDB'
import { connect as connectFirebase } from './firestoreDB'
let db = null

if (config.database.type === DATABASES.FIREBASE) {
  db = connectFirebase()
} else if (config.database.type === DATABASES.MONGODB) {
  // db = connectMongoDB(config.mongoDB)
} else {
  db = connectInMemoryDB()
  if (config.content.initialContent) {
    config.content.initialContent.map((item) => {
      db.collection(item.type).add(item)
    })
  }
}

export default db
