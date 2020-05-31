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

  const request = (data) => {
    const url = `${API.users}/${user.id}`
    setLoading(true)
    setSuccess(false)
    setError(false)

    fetch(url + `?password=${fields.password}`, {
      method: 'DELETE',
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
          'Error deleting your account. Make sure you entered correctly your current password.'
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

    if (password) {
      setError('Missing password')
      return
    }

    request({
      password,
    })
  }

  return (
    <>
      <div className="delete-account">
        <form onSubmit={onSubmit}>
          <div className="block-settings">
            <div className="input-group">
              <label>Delete account</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(ev) =>
                  handleFieldChange('password')(ev.target.value)
                }
              />
            </div>
          </div>

          <div className="actions">
            <div className="info">
              <p>This action cannot be undone.</p>
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">
                  Your account was deleted. You'll be redirected shortly.
                </div>
              )}
            </div>
            <Button loading={loading} alert>
              Delete account
            </Button>
          </div>
        </form>
      </div>

      <style jsx>
        {`
          .actions {
            display: flex;
            justify-content: flex-end;
          }

          .info {
            align-items: center;
            display: flex;
            padding-right: var(--edge-gap);
          }
          .info p {
            font-size: 14px;
          }
        `}
      </style>
    </>
  )
}
