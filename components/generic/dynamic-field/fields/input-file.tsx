import { useState, memo } from 'react'

import Upload from '@components/generic/upload/upload'

function InputFile(props) {
  const [touched, setTouched] = useState(false)
  const onChange = (files) => {
    setTouched(true)
    props.onChange(files)
  }

  return (
    <Upload
      accept={props.field.accept ? props.field.accept : 'image/png, image/jpeg'}
      name={props.field.name}
      required={!!props.field.required}
      multiple={!!props.field.multiple}
      disabled={props.disabled}
      capture={props.field.capture ? props.field.capture : null}
      data-testid={props['data-testid']}
      className={`${touched ? 'touched' : ''}`}
      value={props.value}
      description={
        props.field.multiple
          ? 'You can upload multiple files'
          : 'Upload a single file'
      }
      onChange={onChange}
    />
  )
}

export default memo(InputFile)
