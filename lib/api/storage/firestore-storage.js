export function uploadFile() {
  console.log('Not implemented')
  return Promise.resolve()
}

export function deleteFile() {
  console.log('Not implemented')
  return Promise.resolve()
}

export default function() {
  return {
    uploadFile,
    deleteFile,
  }
}
