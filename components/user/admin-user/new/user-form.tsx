import React, { memo, useCallback, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'
import { FIELDS } from '@lib/constants'
import { FieldType } from '@lib/types/fields'
import config from '@lib/config'
import fetch from '@lib/fetcher'

const allField: FieldType[] = [
  {
    name: 'username',
    type: FIELDS.TEXT,
    label: 'Username',
    required: true,
    minlength: 3,
    maxlength: 48,
  },
  {
    name: 'email',
    type: FIELDS.TEXT,
    label: 'Email',
    required: true,
    pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
  },
  {
    name: 'password',
    type: FIELDS.PASSWORD,
    label: 'Password',
    required: true,
    minlength: 6,
    maxlength: 48,
  },
  ...config.user.profile.fields.filter(({ name }) => name !== 'profile-images'),
  {
    name: 'role',
    type: 'select',
    label: 'role',
    required: true,
    options: config.user.roles,
  },
]

function UserForm() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [fields, setFields] = useState(
    allField.reduce((acc, value) => {
      if (value.type === FIELDS.SELECT) {
        acc[value.name] = value.options[0].value
      }

      return acc
    }, {})
  )
  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    fetch(`${API.users}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields),
    })
      .then(() => {
        setLoading(false)
        setSuccess(true)
        setError('')
      })
      .catch((e) => {
        setLoading(false)
        setSuccess(false)
        e.json().then(({ error }) => {
          setError(error || 'Something went wrong')
        })
      })
  }
  const handleFieldChange = useCallback(
    (name) => (value) => {
      setFields({
        ...fields,
        [name]: value,
      })

      setError('')
    },
    [setFields, setError, fields]
  )

  return (
    <form onSubmit={onSubmit}>
      <>
        {allField.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            value={fields[field.name]}
            onChange={handleFieldChange(field.name)}
          />
        ))}
      </>
      <div className="actions">
        <div className="info">
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Loading...</div>}
          {success && (
            <div className="success-message">
              Profile has been created successfully
            </div>
          )}
        </div>

        <Button loading={loading} alt>
          Create user
        </Button>
      </div>
    </form>
  )
}

export default memo(UserForm)
