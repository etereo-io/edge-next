import { useState } from 'react'
import API from '@lib/api/api-endpoints'
import PasswordStrength from '@components/generic/password-strength/password-strength'
import fetch from '@lib/fetcher'
import Button from '@components/generic/button/button'

export default function({user, ...props}) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [fields, setFields] = useState({})

  const url = `${API.users}/${user.id}/delete`
  
  const request = data => {
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
    .then(result => {
      setLoading(false)
      setSuccess(true)
      setError(false)
      setFields({})
    })
    .catch(err => {
      setLoading(false)
      setSuccess(false)
      setError('Error deleting your account. Make sure you entered correctly your current password.')
    })
  }

  const handleFieldChange = (name) => value => {
    setFields({
      ...fields,
      [name]: value
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
            <p>
              <strong>Warning</strong>, this action can not be undone
            </p>
            <div className="field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(ev) => handleFieldChange('password')(ev.target.value)}
              />
            </div>
          </div>

          <div className="actions">
            <div className="info">
              {error && (
                <div className="error-message">{state.deleteAccount.error}</div>
              )}
              {loading && (
                <div className="loading-message">Loading...</div>
              )}
              {success && (
                <div className="success-message">
                  Your account was deleted. You will be redirected shortly
                </div>
              )}
            </div>
            <Button loading={loading}>Delete</Button>
          </div>
        </form>
      </div>

      <style jsx>
        {
          `
          .actions {
            padding-top: var(--empz-gap);
            display: flex;
            justify-content: flex-end;
          }

          .info {
            padding-right: var(--empz-gap);
          }
          `
        }
      </style>
    </>
  )
}