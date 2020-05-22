import { uploadFile } from '../storage'

// Import files dynamically based on dynamic field definitions
export async function uploadFiles(
  fieldDefinitions,
  files,
  folderPrefix,
  previousItem
) {
  const newData = {}

  if (!files) {
    return newData
  }

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

  return newData
}
