import { memo } from 'react'
import useFieldLength from '@components/generic/dynamic-field/hooks/useFieldLength'
import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'

function InputText(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })
  const { maxLength, minLength } = useFieldLength(props.field)

  return (
    <input
      type={props?.field.type || 'text'}
      name={props.field.name}
      placeholder={props.field.placeholder}
      value={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      minLength={minLength}
      maxLength={maxLength}
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
      onBlur={props.onBlur}
    />
  )
}

export default memo(InputText)
