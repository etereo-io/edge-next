import { memo } from 'react'

import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'

function InputUrl(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })
  const { maxLength, minLength } = useFieldLength(props.field)

  return (
    <input
      type="url"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={minLength}
      maxLength={maxLength}
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

export default memo(InputUrl)
