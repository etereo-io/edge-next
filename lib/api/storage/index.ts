import { STORAGE } from '@lib/constants'
import config from '@lib/config'

import AWSStorage from './aws-storage'
import AzureStorage from './azure-storage'
import FirebaseStorage from './firestore-storage'
import GoogleStorage from './google-storage'

const MAPPING = {
  [STORAGE.GOOGLE]: GoogleStorage,
  [STORAGE.AWS]: AWSStorage,
  [STORAGE.FIREBASE]: FirebaseStorage,
  [STORAGE.AZURE]: AzureStorage,
}

const storage = MAPPING[config.storage.type]

if (!storage) {
  throw new Error('Storage is not implemented')
}

export function uploadFile(file, folder: string): Promise<string> {
  return storage.uploadFile(file.path, file.name, file.type, folder)
}

export function deleteFile(file: string): Promise<boolean> {
  return storage.deleteFile(file)
}
