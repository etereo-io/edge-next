import {  memo } from 'react'

import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'

function InputNumber(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })
  const { min, max } = useFieldLength(props.field)

  return (
    <input
      type="number"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      disabled={props.disabled}
      required={!!props.field.required}
      data-testid={props['data-testid']}
      min={min}
      max={max}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

export default memo(InputNumber)
