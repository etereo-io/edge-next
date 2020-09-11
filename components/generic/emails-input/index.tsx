import * as EmailValidator from 'email-validator'

import { memo, useEffect, useState } from 'react'

function Email(props) {
  const valid = EmailValidator.validate(props.email)
  return (
    <>
      <div className={`email ${!valid ? 'error' : ''}`}>
        {props.email}{' '}
        <span className="close" onClick={props.onClickRemove}>
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path
              id="close-path"
              d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"
            />
          </svg>
        </span>
      </div>
      <style jsx>{`
        .email {
          padding: 4px 4px 4px 8px;
          border-radius: var(--edge-radius);
          color: var(--edge-foreground);
          background: var(--accents-2);
          margin-right: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .email.error {
          background: var(--edge-error-soft);
        }

        .close {
          margin: 5px;
          display: inline-block;
          cursor: pointer;
        }

        svg {
          width: 10px;
          height: 10px;
        }

        #close-path {
          fill: var(--edge-foreground);
        }
      `}</style>
    </>
  )
}

function EmailsInput(props) {
  const defaultEmails = props.defaultValue || []

  const [emails, setEmails] = useState(Array.isArray(defaultEmails) ? defaultEmails: [defaultEmails])
  const [inputValue, setInputValue] = useState('')

  const onKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  const onKeyUp = (ev) => {
    if (ev.key === ',' || ev.key === 'Enter') {
      ev.preventDefault()
      ev.stopPropagation()

      if (ev.target.value) {
        const newEmails = [...emails, ev.target.value.replace(',', '')]
        setEmails(newEmails)

        if (props.onChange) {
          props.onChange(newEmails)
        }
      }

      setInputValue('')
    }
  }

  const onChangeInput = (ev) => {
    setInputValue(ev.target.value)
  }

  const onRemoveEmail = (index) => {
    const newEmails = [
      ...emails.slice(0, index),
      ...emails.slice(index + 1, emails.length),
    ]

    setEmails(newEmails)

    if (props.onChange) {
      props.onChange(newEmails)
    }
  }

  useEffect(() => {
    const newValue = props.value || []
    setEmails(Array.isArray(newValue) ? newValue: [newValue])
  }, [props.value])

  return (
    <>
      <div className="emails-input" data-testid={props['data-testid']}>
        <span className="emails">
          {emails.map((t, i) => (
            <Email key={t.slug} email={t} onClickRemove={() => onRemoveEmail(i)} />
          ))}
        </span>
        <input
          type="text"
          className="input-emails"
          onChange={onChangeInput}
          value={inputValue}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={props.placeholder}
        ></input>
      </div>
      <style jsx>{`
        .emails-input {
          display: flex;
          padding: 10px;
          border: var(--light-border);
          border-radius: var(--edge-radius);
          flex-wrap: wrap;
        }

        .emails {
          display: flex;
          flex-wrap: wrap;
        }

        input {
          border: none;
          outline: none;
          padding: 5px;
          width: 100%;
          flex: 1;
        }
      `}</style>
    </>
  )
}

export default memo(EmailsInput)