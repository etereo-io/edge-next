import React, { useCallback, useState, memo } from 'react'

import { isEditorEmpty } from '../utils'

export interface Props {
  label?: string
  placeholder?: string
  required?: boolean
  modules?: object
  className?: string
  defaultValue?: string
  error?: string
  onChange: (value) => void
}

let ReactQuill

// because of ssr
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill')
}

function Editor({
  onChange,
  label,
  className,
  placeholder,
  required = false,
  modules,
  defaultValue,
  error = '',
}: Props) {
  if (!ReactQuill) {
    return <></>
  }

  const [value, setValue] = useState(defaultValue)
  const [touched, setTouched] = useState(false)
  const isError: boolean = Boolean(touched && error)
  const text = isError && error ? error : placeholder

  const handleChange = useCallback(
    (newValue) => {
      const val = isEditorEmpty(newValue) ? '' : newValue
      setValue(val)
      onChange(val)
    },
    [setValue]
  )

  const handleBlur = useCallback(
    (range, source, quill) => {
      const newValue = quill.getHTML()
      setTouched(isEditorEmpty(newValue) ? '' : newValue)
    },
    [setTouched]
  )

  return (
    <div className={className}>
      {label ? (
        <div>
          {label}
          {required ? '*' : ''}
        </div>
      ) : (
        ''
      )}
      <ReactQuill
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        modules={modules}
      />

      {text ? <div>{text}</div> : ''}
    </div>
  )
}

export default memo(Editor)
