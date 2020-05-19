import AWSStorage from './aws-storage'
import FirebaseStorage from './firestore-storage'
import GoogleStorage from './google-storage'
import { STORAGES } from '../../config/config-constants'
import config from '../../config'

let storage = () => console.error('Storage is not implemented')

switch (config.storage.type) {
  case STORAGES.GOOGLE:
    storage = GoogleStorage
    break

  case STORAGES.AWS:
    storage = AWSStorage

  case STORAGES.FIRESTORE:
    storage = FirebaseStorage
    break
}

export function uploadFile(file, folder) {
  return storage.uploadFile(file.path, file.name, file.type, folder)
}

export function deleteFile(file) {
  return storage.deleteFile(file)
}
