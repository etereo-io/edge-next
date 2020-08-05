import { memo } from 'react'

import useOnChange from '../hooks/useOnChange'

function InputTel(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })

  return (
    <input
      type="tel"
      name={props.field.name}
      placeholder={props.field.placeholder}
      defaultValue={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      required={!!props.field.required}
      pattern={props.pattern || null}
      className={`${touched ? 'touched' : ''}`}
      onChange={onChange}
    />
  )
}

export default memo(InputTel)
