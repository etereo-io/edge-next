import { FIELDS } from '@lib/config/config-constants'
import { deleteFile } from '@lib/api/storage'
import merge from 'deepmerge'
import { uploadFile } from '../storage'

// Import files dynamically based on dynamic field definitions
export async function uploadFiles(
  fieldDefinitions,
  files,
  folderPrefix,
  previousItem,
  newItem
) {
  const newData = {}
  
  if (files) {

    for (const field of fieldDefinitions) {
      if (files[field.name]) {
        // Store the files as an array, allows for easy switch between multiple and single fields
        const fileList = Array.isArray(files[field.name])
          ? files[field.name]
          : [files[field.name]]
  
        if (fileList.length > 0) {
          const filesAdded = []
  
          // Upload all the files
          for (var i = 0; i < fileList.length; i++) {
            const path = await uploadFile(
              fileList[i],
              folderPrefix + '-' + field.name
            )
            filesAdded.push({
              path,
              createdAt: Date.now(),
              name: fileList[i].name,
            })
          }
  
          if (field.multiple === true) {
            newData[field.name] = [
              ...filesAdded,
              ...(previousItem[field.name] || []),
            ]
          } else {
            newData[field.name] = filesAdded
          }
        }
      }
    }
  }

  // Merge the new structures (new item to be inserted + the new pictures fields)
  const newContent = merge(newItem, newData)

  // Check if there are any missing file fields and delete them from storage
  const itemsToDelete = []
  for (const field of fieldDefinitions) {
    if (field.type === FIELDS.IMAGE || field.type === FIELDS.FILE) {
      // Go through all the items and see if in the new content there is any difference
      const previousValue = previousItem[field.name] || []
      previousValue.forEach((f) => {
        if (newItem[field.name]) {
          // if the data we are updating includes this field, check if there was any path in the previous item that is not here now
          // and delete it 
          /* 
            Example: Previous item : image = [{ path: 'abc' }]
            currentItem : image= [{ path: 'bcjh' }]  we will delete the previous 'abc' file
          */
          if (!newItem[field.name].find((item) => item.path === f.path)) {
            itemsToDelete.push(f)
          }
        }
      })
    }
  }

  // Delete old items from storage
  for (let i = 0; i < itemsToDelete.length; i++) {
    try {
      await deleteFile(itemsToDelete[i].path)
    } catch (err) {
      // Error deleting file, ignore ite
    }
  }

  return newContent
}
