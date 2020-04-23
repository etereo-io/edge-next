import { DATABASES } from '../../config/config-constants'
import config from '../../config'
import { connect as connectFirebase } from './firestoreDB'
import { connect as connectInMemoryDB } from './inMemoryDB'
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

    config.user.initialUsers.map((item) => {
      db.collection('users').add(item)
    })

    config.activity.initialActivity.map((item) => {
      db.collection('activity').add(item)
    })
  }
}

export default db
