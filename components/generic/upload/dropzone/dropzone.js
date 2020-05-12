import React, { useState } from 'react'

export default function (props) {
  const fileInputRef = React.createRef()
  const [highlighted, setHighlighted] = useState(false)

  const openFileDialog = () => {
    if (props.disabled) return
    fileInputRef.current.click()
  }

  const fileListToArray = (list) => {
    const array = []
    for (var i = 0; i < list.length; i++) {
      array.push({
        isFile: true,
        src: null,
        file: list.item(i)
      })
    }
    return array
  }

  const addFiles = (files) => {
    if (props.onFilesAdded) {
      const array = fileListToArray(files)
      const promises = array.map(fileObject => {

        // Preload all the srcs for display
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
  
          reader.onload = function (e) {
            resolve({
              ...fileObject,
              src: e.target.result
            })
          };
  
          reader.readAsDataURL(fileObject.file);

        })
      }) 

      props.onLoading(true)

      Promise.all(promises)
        .then(results => {
          props.onFilesAdded(results)
          props.onLoading(false)
        })
    }
  }

  const onFilesSelected = (ev) => {
    if (props.disabled) return
    const files = ev.target.files
    addFiles(files)
  }

  const onDrop = (evt) => {
    evt.preventDefault()

    if (props.disabled) return

    const files = evt.dataTransfer.files
    addFiles(files)

    setHighlighted(false)
  }

  const onDragLeave = (evt) => {
    setHighlighted(false)
  }

  const onDragOver = (evt) => {
    evt.preventDefault()

    if (props.disabled) return

    setHighlighted(true)
  }

 

  return (
    <>
      <div
        className={`dropzone ${highlighted && 'highlight'}`}
        style={{ cursor: props.disabled ? 'default' : 'pointer' }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openFileDialog}
      >
        <p>Drag & Drop files here to upload</p>
        <input
          ref={fileInputRef}
          className="fileinput"
          type="file"
          multiple={props.multiple}
          accept={props.accept}
          required={props.required}
          name={props.name}
          onChange={onFilesSelected}
        />
      </div>
      <style jsx>{`
        .dropzone {
          padding: var(--empz-gap);
          border: 2px dashed var(--empz-foreground);
          color: var(--empz-foreground);
          cursor: pointer;
          text-align: center;
        }
        .fileinput {
          display: none;
        }

        .dropzone.highlight {
          background-color: rgb(188, 185, 236);
        }
      `}</style>
    </>
  )
}
