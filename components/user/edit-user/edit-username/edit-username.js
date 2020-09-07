import { useState, useEffect, memo } from 'react'

import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import Button from '@components/generic/button/button'

function EditUsername({ user, onChange = () => {}, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({})

  const request = (data) => {
    const url = `${API.users}/${user.id}/username`
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
        onChange()
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(
          'Error updating your username. This username is already taken.'
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
    const username = ev.currentTarget.username.value

    if (username.length < 3) {
      setError('Invalid username')
      return
    }

    request({
      username,
    })
  }

  // Set default data
  useEffect(() => {
    setFields({
      username: user.username,
    })
  }, [user])

  return (
    <>
      <div className="change-username">
        <form onSubmit={onSubmit}>
          <div className={`input-group required ${error ? 'error' : ''}`}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Your username"
              name="username"
              pattern="[a-z\d_-]+$"
              onChange={(ev) => handleFieldChange('username')(ev.target.value)}
              value={fields.username}
            />
            <span className="description">
              A single word with letters, numbers, upperscores and underscores
              allowed. Example: jonh-doe123, mrs_shirley2
            </span>
          </div>
          <div className="actions">
            <div className="info">
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">
                  Username updated correctly
                </div>
              )}
            </div>

            <Button loading={loading} alt>
              Save changes
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
            padding-right: var(--edge-gap);
          }
        `}
      </style>
    </>
  )
}

export default memo(EditUsername)
