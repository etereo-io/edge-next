import config from '../config'
import databases from '../config-constants/databases'

let db = null

const connectFirebase = () => {
    console.log('Connected')
    return Promise.resolve()
}

const connectMongoDB = () => {
    console.log('Connected to mongo')
    return Promise.resolve()
}

export function connect() {
  if (config.database === databases.FIREBASE) {
      return connectFirebase(config.firebase)
  } else {
      return connectMongoDB(config.mongoDB)
  }
}

export default db