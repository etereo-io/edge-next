import { memo } from 'react'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'
import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'

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
      step="any"
      onChange={onChange}
    />
  )
}

export default memo(InputNumber)
