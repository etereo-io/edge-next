import config from '../../config'
import { STORAGES } from '../../config/config-constants'

let storage = () => console.error('Storage is not implemented')

switch (config.storage) {
  case STORAGES.GOOGLE:
    storage = require('./google-storage')
    break

  case STORAGES.AWS:
    storage = require('./aws-storage')

  case STORAGES.FIRESTORE:
    storage = require('./firestore-storage')
    break
}

export async function upload(files, folder) {
  const newFiles = []
  for (const file of files) {
    try {
      const destination = await storage.upload(
        file.buffer,
        file.originalname,
        folder
      )
      newFiles.push({ path: destination })
    } catch (error) {
      console.error(`Error uploading file to bucket: ${JSON.stringify(error)}`)
    }
  }

  return newFiles
}
