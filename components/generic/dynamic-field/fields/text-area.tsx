import { memo } from 'react'

import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'

function TextArea(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })
  const { maxLength, minLength } = useFieldLength(props.field)

  return (
    <textarea
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      disabled={props.disabled}
      minLength={minLength}
      maxLength={maxLength}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

export default memo(TextArea)
