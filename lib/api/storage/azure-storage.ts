import { BlobService, createBlobService } from 'azure-storage'

import AbstractStorage from './abstract-storage'
import slugify from 'slugify'

class AzureStorage implements AbstractStorage {
  blobService: BlobService

  constructor(
    private readonly connectionString: string,
    private readonly account: string,
    private readonly container: string
  ) {
    this.blobService = createBlobService()
  }

  get publicPath(): string {
    return `https://${this.account}.blob.core.windows.net/${this.container}/`
  }

  getBlobPath(name): string {
    return `${this.publicPath}${name}`
  }

  async uploadFile(
    filePath: string,
    name: string,
    type: string,
    folder: string
  ): Promise<string> {
    const destination = `${folder}/${slugify(Date.now() + ' ' + name)}`

    // because upload isn't an async function
    return new Promise<string>((resolve, reject) => {
      this.blobService.createBlockBlobFromLocalFile(
        this.container,
        destination,
        filePath,
        (error) => {
          if (error) {
            console.log('Error happened during file uploading. ', error)
            reject(error)
          } else {
            resolve(this.getBlobPath(destination))
          }
        }
      )
    })
  }

  async deleteFile(file: string): Promise<boolean> {
    // because deleteBlob isn't an async function
    return new Promise<boolean>((resolve, reject) => {
      this.blobService.deleteBlob(
        this.container,
        file.replace(this.publicPath, ''),
        (error) => {
          if (error) {
            console.log('Error happened during file removing. ', error)

            reject(error)
          } else {
            resolve(true)
          }
        }
      )
    })
  }
}


export default function Initialize() {
  const instance = new AzureStorage(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_CONTAINER
  )
  
  return instance
}
