import { memo } from 'react'

import TagsInput from '@components/generic/tags-input/tags-input'

function InputTags(props) {
  return (
    <TagsInput
      placeholder={props.field.placeholder}
      name={props.field.name}
      value={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      onChange={(val) => props.onChange(val)}
    />
  )
}

export default memo(InputTags)
