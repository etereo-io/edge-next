import EmailsInput from '@components/generic/emails-input'
import { memo } from 'react'

function InputEmails(props) {
  return (
    <EmailsInput
      placeholder={props.field.placeholder}
      name={props.field.name}
      value={props.value}
      disabled={props.disabled}
      data-testid={props['data-testid']}
      onChange={(val) => props.onChange(val)}
    />
  )
}

export default memo(InputEmails)
