import * as admin from 'firebase-admin'
import config from '../config'

export function connect() {
  try {
    const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
        //privateKey: firebasePrivateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      throw err
    }
  }

  return admin.firestore()
}

/*
https://github.com/rauchg/blog/blob/master/lib/db-admin.js
If it is not for performance-wise, I would have used mongoose. If you are using Mongoose, you only need to make some adjustments:
Check my previous reply to this thread on connecting using Mongoose. You don't attach db to req like my example.
Instead of isConnected(), check for mongoose.connections[0].readyState
You will need a user model.
do not call req.db.collection('users').findOne. Instead, youimport User from 'path/to/UserModel.js'. Then call User.findOne, ex.
Feel free to ask me if you have any trouble.
https://spectrum.chat/next-js/general/api-with-mongodb-using-api-routes~a05e7920-7a77-4fa2-8be9-8d1d2810499d
*/
