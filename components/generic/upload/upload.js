import { useState, useEffect } from 'react'

import Dropzone from './dropzone/dropzone'

export default function ({ accept, name, required, multiple, ...props }) {
  const inputProps = { accept, name, required, multiple }
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const onFilesAdded = (f) => {
    const newFiles = multiple ? [...files, ...f] : [...f]

    setFiles(newFiles)
    props.onChange ? props.onChange(newFiles) : null
  }

  const deleteFile = (index) => {
    const newFiles = files.filter((f, i) => i !== index)

    setFiles(newFiles)
    props.onChange ? props.onChange(newFiles) : null
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
    if (props.value) {
      Array.isArray(props.value)
        ? setFiles(props.value)
        : setFiles([props.value])
    }
  }, [props.value])

  return (
    <>
      <div className="file-upload" data-testid={props['data-testid']}>
        <div className="content">
          <div>
            <Dropzone
              onFilesAdded={onFilesAdded}
              {...inputProps}
              onLoading={setLoading}
              description={props.description}
            />
          </div>
          <div className="files">
            {loading && <div className="loading">Loading...</div>}
            {files.map((file, index) => (
              <div
                className="file-row"
                key={file.isFile ? file.file.name : file.name}
              >
                <span className="file-name">
                  {file.isFile ? file.file.name : file.name}
                </span>
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
          margin-top: var(--empz-gap);
          margin-bottom: var(--empz-gap);
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
          color: var(--empz-foreground);
        }

        .delete-file {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
