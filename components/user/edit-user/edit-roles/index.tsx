import { memo, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicFieldEdit from '@components/generic/dynamic-field/dynamic-field-edit'
import config from '@lib/config'
import fetch from '@lib/fetcher'

function EditRoles({ user,  onChange = () => {} }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [roles, setRoles] = useState([])

  const request = (data) => {
    const url = `${API.users}/${user.id}/roles`
    setLoading(true)
    setSuccess(false)
    setError('')

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
        setError('')
        onChange()
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError('Error updating the user roles.')
      })
  }

  const onSubmit = (ev) => {
    ev.preventDefault()

    if (roles.length < 1) {
      setError('Invalid roles')
      return
    }

    request({
      roles,
    })
  }

  // Set default data
  useEffect(() => {
    setRoles(user.roles)
  }, [user])

  return (
    <>
      <div className="change-password">
        <form onSubmit={onSubmit}>
          
          <DynamicFieldEdit 
            name="roles"
            value={roles}
            onChange={(val) => setRoles(val)}
            field={{
              name: 'roles',
              type: 'radio',
              label: 'roles',
              multiple: true,
              options: config.user.roles.filter(r => r.value !== 'PUBLIC'),
            }} />

          <div className="actions">
            <div className="info">
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">
                  Roles updated correctly
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

export default memo(EditRoles)