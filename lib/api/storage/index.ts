import AWSStorage from './aws-storage'
import AzureStorage from './azure-storage'
import FirebaseStorage from './firestore-storage'
import GoogleStorage from './google-storage'
import { STORAGE } from '@lib/constants'
import config from '@lib/config'
import logger from '@lib/logger'

const MAPPING = {
  [STORAGE.GOOGLE]: GoogleStorage,
  [STORAGE.AWS]: AWSStorage,
  [STORAGE.FIREBASE]: FirebaseStorage,
  [STORAGE.AZURE]: AzureStorage,
}

const storage = MAPPING[config.storage.type] ? MAPPING[config.storage.type]() : null

export function uploadFile(file, folder: string): Promise<string> {
  if (!storage) {
    logger('ERROR', 'Storage not implemented')
    throw new Error('Storage missing')
  }
  return storage.uploadFile(file.path, file.name, file.type, folder)
}

export function deleteFile(file: string): Promise<boolean> {
  if (!storage) {
    logger('ERROR', 'Storage not implemented')
    throw new Error('Storage missing')
  }
  return storage.deleteFile(file)
}
