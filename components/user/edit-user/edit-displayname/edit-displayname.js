import { useState, useEffect } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import Button from '@components/generic/button/button'

export default function ({ user, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({})

  const url = `${API.users}/${user.id}/profile`

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
        setError('Error updating your name, please try again later.')
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
    const displayName = ev.currentTarget.displayName.value

    if (displayName.length < 3) {
      setError('Invalid displayName')
      return
    }

    request({
      displayName,
    })
  }

  // Set default data
  useEffect(() => {
    setFields({
      displayName: user.profile.displayName,
    })
  }, [user])

  return (
    <>
      <div className="change-displayname">
        <form onSubmit={onSubmit}>
          <div className={`input-group required ${error ? 'error' : ''}`}>
            <label>Name</label>
            <input
              type="text"
              name="displayName"
              placeholder="Your username"
              onChange={(ev) =>
                handleFieldChange('displayName')(ev.target.value)
              }
              value={fields.displayName}
            />
          </div>
          <div className="actions">
            <div className="info">
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">Name updated correctly</div>
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
            padding-right: var(--empz-gap);
          }
        `}
      </style>
    </>
  )
}
