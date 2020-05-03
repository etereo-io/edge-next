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
      array.push(list.item(i))
    }
    return array
  }

  const onFilesAdded = (ev) => {
    if (props.disabled) return
    const files = ev.target.files
    if (props.onFilesAdded) {
      const array = fileListToArray(files)
      props.onFilesAdded(array)
    }
  }

  const onDragLeave = (evt) => {
    setHighlighted(false)
  }

  const onDragOver = (evt) => {
    evt.preventDefault()

    if (props.disabled) return

    setHighlighted(true)
  }

  const onDrop = (evt) => {
    evt.preventDefault()

    if (props.disabled) return

    const files = evt.dataTransfer.files
    if (props.onFilesAdded) {
      const array = fileListToArray(files)
      props.onFilesAdded(array)
    }

    setHighlighted(false)
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
        multiple
        onChange={onFilesAdded}
      />
    </div>
    <style jsx>{
        `
        .dropzone {
          padding: 15px;
          border: 2px dashed grey;
          color: grey;
          cursor: pointer;
          text-align: center;
        
        }
        .fileinput {
          display: none;
        }
      
        .dropzone.highlight {
          background-color: rgb(188, 185, 236);
        }
        `
      }</style>
    </>
  )
}
