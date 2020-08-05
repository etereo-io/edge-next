import { useState, memo } from 'react'

import Upload from '@components/generic/upload/upload'

function InputImage(props) {
  const [touched, setTouched] = useState(false)

  const onChange = (files) => {
    setTouched(true)
    props.onChange(files)
  }

  return (
    <>
      <Upload
        accept={
          props.field.accept ? props.field.accept : 'image/png, image/jpeg'
        }
        name={props.field.name}
        required={!!props.field.required}
        multiple={!!props.field.multiple}
        disabled={props.disabled}
        data-testid={props['data-testid']}
        className={`${touched ? 'touched' : ''}`}
        value={props.value}
        description={
          props.field.multiple
            ? 'Upload multiple images to display a carousel'
            : 'Upload a single image'
        }
        onChange={onChange}
      />
    </>
  )
}

export default memo(InputImage)
