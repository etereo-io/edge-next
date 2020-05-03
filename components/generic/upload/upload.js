import { useState, useEffect } from 'react'

import Dropzone from './dropzone/dropzone'


export default function (props) {
  const [files, setFiles] = useState([])

  const onFilesAdded = (f) => {
    const newFiles = [...files, ...f]

    setFiles(newFiles)
    props.onChange ? props.onChange(newFiles): null
  }

  const deleteFile = (index) => {
    const newFiles = files.filter((f, i) => i !== index)
    
    setFiles(newFiles)
    props.onChange ? props.onChange(newFiles): null
  }

  // const renderProgress = file => {
  //   const uploadProgress = uploadProgress[file.name]

  //   if (uploading || successUpload) {
  //     return (
  //       <div className="progress-wrapper">
  //         <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
  //         <img
  //           className="check-icon"
  //           alt="done"
  //           src="baseline-check_circle_outline-24px.svg"
  //           style={{
  //             opacity:
  //               uploadProgress && uploadProgress.state === 'done' ? 0.5 : 0
  //           }}
  //         />
  //       </div>
  //     )
  //   }
  // }

  useEffect(() => {
    if (props.files) {
      setFiles(props.files)
    }
  }, [props.files])

  return (
    <>
      <div className="file-upload">
        <div className="content">
          <div>
            <Dropzone onFilesAdded={onFilesAdded} />
          </div>
          <div className="files">
            {files.map((file, index) => (
              <div className="file-row" key={file.name}>
                <span className="file-name">{file.name}</span>
                <div className="delete-file" onClick={() => deleteFile(index)}>
                  Delete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
      .files {
        margin-top: 15px;
        margin-bottom: 15px;
      }

      .file-row {
        display: flex;
        margin-bottom: 5px;
        justify-content: space-between;
      }

      .file-name {
        max-width: 200px;
        text-overflow: ellipsis;
        font-size: 13px;
        color: grey;
      }

      .delete-file {
        cursor: pointer;
      }
      `}</style>
    </>
  )
}
