import { useState, useEffect } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import Button from '@components/generic/button/button'
import config from '@lib/config'
import { FIELDS } from '@lib/config/config-constants'
import DynamicField from '@components/generic/dynamic-field/dynamic-field-edit'

export default function ({ user, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({})

  const url = `${API.users}/${user.id}/profile`

  const request = (formData, jsonData) => {
    setLoading(true)
    setSuccess(false)
    setError(false)

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((result) => {
        // Files are always updated as a PUT
        return fetch(url, {
          method: 'PUT',
          body: formData,
        })
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
          'Error updating your profile information. Please try again later.'
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

    let valid = true

    // TODO: is this even needed?
    /*config.user.profile.fields.forEach((f) => {
      if (f.required && !d[f.name]) {
        valid = false
      }

      if (f.minlength && d[f.name].length < f.minlength) {
        valid = false
      }

      if (f.maxlength && d[f.name].length > f.maxlength) {
        valid = false
      }
    })*/

    if (!valid) {
      setError('Please check that the data is correct')
      return
    }

    const formData = new FormData()
    const jsonData = {}

    Object.keys(fields).forEach((key) => {
      const fieldValue = fields[key]
      const fieldDefinition = config.user.profile.fields.find(
        (t) => t.name === key
      )

      if (
        fieldDefinition &&
        (fieldDefinition.type === FIELDS.IMAGE ||
          fieldDefinition.type === FIELDS.FILE)
      ) {
        if (fieldValue && fieldValue.length > 0) {
          jsonData[key] = []

          fieldValue.forEach((item) => {
            if (item.isFile) {
              formData.append(key, item.file)
            } else {
              jsonData[key] = jsonData[key] ? [...jsonData[key], item] : [item]
            }
          })
        } else {
          jsonData[key] = []
        }
      } else {
        jsonData[key] = fieldValue
      }
    })

    request(formData, jsonData)
  }

  // Set default data
  useEffect(() => {
    const newFields = {}
    config.user.profile.fields.forEach((f) => {
      newFields[f.name] = user.profile ? user.profile[f.name] : null
    })
    setFields(newFields)
  }, [user])

  return (
    <>
      <div className="change-displayname">
        <form onSubmit={onSubmit}>
          <div className="block-settings">
            {config.user.profile.fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={fields[field.name]}
                onChange={handleFieldChange(field.name)}
              />
            ))}
          </div>
          <div className="actions">
            <div className="info">
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-message">Loading...</div>}
              {success && (
                <div className="success-message">profile updated correctly</div>
              )}
            </div>

            <Button loading={loading} alt>Save changes</Button>
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
