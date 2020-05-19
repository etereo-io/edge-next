/**
 * Disclaimer the Firebase implementation is not finished.
 *
 * It is added as an example but it has been not tested,
 * neither abstracted correctly to work without having to change the queries
 */

import * as admin from 'firebase-admin'

import Database from './Database'

function connectToFirebase() {
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

class db extends Database {
  constructor() {
    super()
    this.db = connectToFirebase()

    this.limitIndex = 0
    this.startIndex = 0
    this.col = ''
  }

  nativeDriver() {
    return this.db
  }

  add(item) {
    return this.db
      .collection(this.col)
      .add(item)
      .then((ref) => {
        return ref.data()
      })
  }

  count(options) {
    // Not implemented
    return Promise.resolve(0)
  }

  find(options = {}) {
    console.log('DB - Find', this.col, options)

    let query = this.db.collection(this.col)

    // This is hacky
    Object.keys(options).forEach((k) => {
      query.where(k, '==', options[k])
    })

    return (
      query
        .get()
        // .orderBy('createdAt')
        // .limit(this.limitIndex)
        //.startAt() pagination is complex with firestore, you need to send in previous references
        .then((snapshot) => {
          if (snapshot.empty) {
            return
          }

          const results = []
          snapshot.forEach((doc) => {
            results.push(doc.data())
          })

          return results
        })
    )
  }

  findOne(options = {}) {
    console.log('DB - findOne', this.col, options)

    return this.find(options).then((results) => (results ? results[0] : null))
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
        return this.db
          .collection(this.col)
          .doc(id)
          .set(newItemData, { merge: true })
          .then((doc) => {
            if (!doc.exists) {
              return null
            } else {
              return doc.data()
            }
          })
      },
      get: () => {
        return this.db
          .collection(this.col)
          .doc(id)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              return null
            } else {
              return doc.data()
            }
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
}

export const connect = async () => {
  return new db()
}
