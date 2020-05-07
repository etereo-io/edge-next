// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage'

// Creates a client
const storage = new Storage()

export function upload(file, bucketName, destination) {
  return new Promise((resolve, reject) => {
    const bucket = storage.bucket(bucketName)
    const bucketFile = bucket.file(destination)

    bucketFile.save(file, function (err) {
      if (err) reject(err)
      resolve(destination)
    })
  })
}
