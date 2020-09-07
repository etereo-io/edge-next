import AbstractStorage from './abstract-storage'
import { Storage } from '@google-cloud/storage'
import slugify from 'slugify'

class GoogleStorage implements AbstractStorage {
  constructor(
    private readonly storage: Storage,
    private readonly bucketName: string
  ) {}

  get publicPath(): string {
    return 'https://storage.googleapis.com'
  }

  get privatePath(): string {
    return 'https://storage.cloud.google.com'
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
      this.storage.bucket(this.bucketName).upload(
        filePath,
        {
          // Support for HTTP requests made with `Accept-Encoding: gzip`
          gzip: true,
          // By setting the option `destination`, you can change the name of the
          // object you are uploading to a bucket.
          destination,
          metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
          },
        },
        (error) => {
          if (error) {
            console.log('Error happened during file uploading. ', error)
            reject(error)
          } else {
            resolve(`${this.publicPath}/${this.bucketName}/${destination}`)
          }
        }
      )
    })
  }

  async deleteFile(file: string): Promise<boolean> {
    // because delete isn't an async function
    return new Promise<boolean>((resolve, reject) => {
      this.storage
        .bucket(this.bucketName)
        .file(file.replace(`${this.publicPath}/${this.bucketName}/`, ''))
        .delete((error) => {
          if (error) {
            console.log('Error happened during file removing. ', error)

            reject(error)
          } else {
            resolve(true)
          }
        })
    })
  }
}


export default function Initialize() {
  const storage = new Storage({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    },
    projectId: process.env.GOOGLE_PROJECTID,
  })
  
  const instance = new GoogleStorage(storage, process.env.GOOGLE_BUCKET_NAME)
  
  return instance
}
