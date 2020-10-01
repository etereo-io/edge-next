import { memo } from 'react'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'
import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'

function InputTime(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })
  const { min, max } = useFieldLength(props.field)

  return (
    <input
      type="time"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      min={min}
      max={max}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

export default memo(InputTime);