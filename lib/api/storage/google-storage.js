// Imports the Google Cloud client library

import { Storage } from '@google-cloud/storage'
import slugify from 'slugify'

// Creates a client
const storage = new Storage()
const bucketName = process.env.GOOGLE_BUCKET_NAME
const publicpath = 'https://storage.googleapis.com'
const privatePath = 'https://storage.cloud.google.com'

export async function uploadFile(filePath, name, type, folder) {
  const destination = `${folder}/${slugify(Date.now() + ' ' + name)}`
  
  await storage.bucket(bucketName).upload(filePath, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    destination: destination,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  })

  return `${publicpath}/${bucketName}/${destination}`
}

export async function deleteFile(file) {
  await storage.bucket(bucketName).file(file.replace( `${publicpath}/${bucketName}/`, '')).delete();
}


export default {
  uploadFile,
  deleteFile
}