import { useState, memo } from 'react'

function Radio(props) {
  const [touched, setTouched] = useState(false)
  const value = props.field.multiple ? props.value || [] : props.value

  const onChange = (ev) => {
    setTouched(true)

    const isChecked = ev.target.checked
    const itemValue = ev.target.value
    let newValues = value

    if (props.field.multiple) {
      if (isChecked) {
        newValues = [...newValues, itemValue]
      } else {
        newValues = [...newValues.filter((i) => i !== itemValue)]
      }
    } else {
      newValues = itemValue
    }

    props.onChange(newValues, ev)
  }

  return (
    <div
      data-testid={props['data-testid']}
      className={`${touched ? 'touched' : ''}`}
    >
      {props.field.options.map((o) => {
        return (
          <div className="input-radio" key={o.label}>
            <input
              type={props.field.multiple ? 'checkbox' : 'radio'}
              id={props['data-testid'] + o.value}
              key={props['data-testid'] + o.value}
              value={o.value}
              disabled={props.disabled}
              checked={
                props.field.multiple
                  ? value.includes(o.value)
                  : value === o.value
              }
              name={props.field.name}
              onChange={onChange}
            />
            <label htmlFor={props['data-testid'] + o.value}>{o.label}</label>
          </div>
        )
      })}
    </div>
  )
}

export default memo(Radio)
