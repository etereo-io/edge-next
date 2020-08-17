import React, { useState } from 'react'

export default function Named(props) {
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
        file: list.item(i),
      })
    }
    return array
  }

  const addFiles = (files) => {
    if (props.onFilesAdded) {
      const array = fileListToArray(files)
      const promises = array.map((fileObject) => {
        // Preload all the srcs for display
        return new Promise((resolve, reject) => {
          var reader = new FileReader()

          reader.onload = function (e) {
            resolve({
              ...fileObject,
              src: e.target.result,
            })
          }

          reader.readAsDataURL(fileObject.file)
        })
      })

      props.onLoading(true)

      Promise.all(promises).then((results) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 385">
          <defs />
          <g fill="#000" fillRule="nonzero">
            <path d="M315.3067 266.36l-48-48c-6.2507-6.2507-16.384-6.2507-22.6347 0l-48 48c-10.048 10.0267-2.944 27.3067 11.3067 27.3067h26.688V363c0 11.776 9.536 21.3333 21.3333 21.3333 11.7973 0 21.3333-9.5573 21.3333-21.3333v-69.3333H304c14.272 0 21.376-17.28 11.3067-27.3067z" />
            <path d="M398.3573 84.1093C370.368 32.9307 315.4987.3333 256 .3333c-75.6267 0-141.2267 52.5867-157.8027 124.352C43.072 130.488 0 176.7813 0 232.8667c0 59.9893 49.3227 108.8 109.9093 108.8H192v-7.5307c-17.0027-4.8-31.1893-17.1093-38.208-34.0053-9.088-22.1227-4.0533-47.1894 12.7573-64l47.9787-47.9574c22.1653-22.1653 60.8-22.1653 82.9653 0l48 48c16.8107 16.7894 21.8027 41.8347 12.7787 63.8294-7.04 16.9813-21.248 29.312-38.2507 34.112v7.552h61.2267c72.1067 0 130.7733-58.0694 130.7733-129.4294-.0213-65.408-49.2373-120-113.664-128.128z" />
          </g>
        </svg>
        <p className="dropzone-text">Drag and drop files</p>
        {props.description && (
          <small className="dropzone-description">{props.description}</small>
        )}
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
          padding: var(--edge-gap);
          border: 2px dashed var(--accents-2);
          color: var(--edge-foreground);
          cursor: pointer;
          text-align: center;
          transition: border-color 0.3s ease;
        }

        .dropzone:hover  {
          border: 2px dashed var(--edge-success);
        }

        .dropzone:hover svg path {
          fill: var(--edge-success);
        }

        .fileinput {
          display: none;
        }

        .dropzone.highlight {
          background-color: rgb(188, 185, 236);
        }

        svg {
          width: 80px;
        }

        svg path {
          fill: var(--accents-2);
          transition: fill 0.3s ease;
        }

        .dropzone-text {
          font-size: 21px;
          font-weight: 600;
        }

        .dropzone-description {
          color: var(--accents-3);
          display: block;
          margin-top: 4px;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}
