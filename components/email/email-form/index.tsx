import React, { useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import { UserType } from '@lib/types'
import fetch from '@lib/fetcher'

type PropTypes = {
  onSubmitted: () => void,
  onCancel: () => void,
  user: UserType
}

export default function EmailForm({
  onSubmitted,
  onCancel,
  user
}: PropTypes) {
  const [from, setFrom] = useState(user ? user.email : '')
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorEmptyFields, setErrorEmptyFields] = useState(false)

  useEffect(() => {
    setFrom(user ? user.email : '')
  }, [user])

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    if ((!to && !cc && !bcc) || !html || !subject) {
      setErrorEmptyFields(true)
      return
    } else {
      setErrorEmptyFields(false)
    }

    setLoading(true)
    setError(false)

    fetch(API.email, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        cc,
        bcc,
        subject,
        html
      }),
    })
      .then(() => {
        setError(false)
        setLoading(false)
        onSubmitted()
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }


  const onClickCancel = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    onCancel()
  }

  return (
    <>
      <div className="email-form">
        <h3>New email</h3>
        <form onSubmit={onSubmit}>
        <DynamicFieldEdit
            value={from}
            onChange={(val) => setFrom(val)}
            field={{
              name: 'from',
              type: 'text',
              label: 'From',
            }}
          />
          <DynamicFieldEdit
            value={to}
            onChange={(val) => setTo(val)}
            field={{
              name: 'to',
              type: 'emails',
              label: 'To',
            }}
          />

          <DynamicFieldEdit
            value={cc}
            onChange={(val) => setCc(val)}
            field={{
              name: 'cc',
              type: 'emails',
              label: 'CC',
            }}
          />

          <DynamicFieldEdit

            value={bcc}
            onChange={(val) => setBcc(val)}
            field={{
              name: 'bcc',
              type: 'emails',
              label: 'BCC',
            }}
          />

          <DynamicFieldEdit
            value={subject}
            onChange={(val) => setSubject(val)}
            field={{
              name: 'subject',
              type: 'text',
              label: 'Subject',
            }}
          />


          <DynamicFieldEdit
            value={html}
            onChange={(val) => setHtml(val)}
            field={{
              name: 'text',
              type: 'rich_text',
              label: 'Message',
            }}
          />

          {errorEmptyFields && <div className="error-message">
            Please complete all the required fields
          </div>}
          {error && <div className="error-message">
            Error sending the email
          </div>}
          <div className="actions">
            <Button loading={loading}>Send</Button>

            <Button alt onClick={onClickCancel}>Cancel</Button>
          </div>
        </form>
      </div>
      <style jsx>{
        `
        .email-form {
          padding: var(--edge-gap);
          background: var(--edge-background);
          border-radius: var(--edge-radius);
          margin-top: var(--edge-gap);
        }
        .actions {
          display: flex;
          justify-content: space-evenly;
        }
        `
      }</style>
    </>
  )
}