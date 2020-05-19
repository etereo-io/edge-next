import { useState } from 'react'
import API from '@lib/api/api-endpoints'
import PasswordStrength from '@components/generic/password-strength/password-strength'
import fetch from '@lib/fetcher'
import Button from '@components/generic/button/button'

export default function ({ user, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({})

  const url = `${API.users}/${user.id}/password`

  const request = (data) => {
    setLoading(true)
    setSuccess(false)
    setError(false)

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        setLoading(false)
        setSuccess(true)
        setError(false)
        setFields({})
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(
          'Error updating your password. Make sure you entered correctly your current password.'
        )
      })
  }

  const handleFieldChange = (name) => (value) => {
    setFields({
      ...fields,
      [name]: value,
    })

    setError('')
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    const password = ev.currentTarget.password.value
    const newpassword = ev.currentTarget.newpassword.value
    const rnewpassword = ev.currentTarget.rnewpassword.value

    if (rnewpassword !== newpassword) {
      setError('Passwords do not match')
      return
    }

    if (newpassword.length < 6) {
      setError('Password length should be more than 6')
      return
    }

    request({
      password,
      newpassword,
      rnewpassword,
    })
  }

  return (
    <>
      <div className="change-password">
        <form onSubmit={onSubmit}>
          <div className="block-settings">
            <div className="input-group required">
              <input
                type="password"
                name="password"
                onChange={(ev) =>
                  handleFieldChange('password')(ev.target.value)
                }
                value={fields.password}
                placeholder="Current Password"
              />
            </div>
            <div className="input-group required">
              <input
                type="password"
                name="newpassword"
                required
                onChange={(ev) => {
                  handleFieldChange('newpassword')(ev.target.value)
                }}
                value={fields.newpassword}
                placeholder="New Password"
              />
            </div>
            <div className="input-group required">
              <input
                type="password"
                name="rnewpassword"
                required
                onChange={(ev) => {
                  handleFieldChange('rnewpassword')(ev.target.value)
                }}
                value={fields.rnewpassword}
                placeholder="Repeat new Password"
              />
            </div>

            <PasswordStrength password={fields.newpassword} />
          </div>

          <div className="actions">
            <div className="info">
              {fields.newpassword &&
                fields.newpassword !== fields.rnewpassword && (
                  <div className="error-message">Passwords do not match</div>
                )}

              {error && <div className="error-message">{error}</div>}

              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">
                  password updated correctly
                </div>
              )}
            </div>
            <Button loading={loading}>Update</Button>
          </div>
        </form>
      </div>

      <style jsx>
        {`
          .actions {
            padding-top: var(--empz-gap);
            display: flex;
            justify-content: flex-end;
          }

          .info {
            padding-right: var(--empz-gap);
          }
        `}
      </style>
    </>
  )
}
