import { memo } from 'react'
import useOnChange from '@components/generic/dynamic-field/hooks/useOnChange'

function Select(props) {
  const { onChange, touched } = useOnChange({ onChangeHandler: props.onChange })

  return (
    <div className="input-select">
      <select
        data-testid={props['data-testid']}
        name={props.field.name}
        disabled={props.disabled}
        className={`${touched ? 'touched' : ''}`}
        onChange={onChange}
        value={props.value}
      >
        {props.field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default memo(Select)
