import { memo, useCallback } from 'react'

import { FieldType } from '@lib/types/fields'
import { Editor, isEditorEmpty } from '@components/generic/rich-text-editor'

interface Props {
  field: FieldType
  value: string
  onChange: (value, isValid) => void
}

function RichText({ field: { required }, value = '', onChange }: Props) {
  const onChangeHandler = useCallback(
    (value) => {
      const isValid = !required || !isEditorEmpty(value)

      onChange(value, isValid)
    },
    [onChange]
  )

  return <Editor defaultValue={value} onChange={onChangeHandler} />
}

export default memo(RichText)
