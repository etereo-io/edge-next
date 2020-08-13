import { useState, createRef, useEffect } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'

export default function Named({ user, onChange = () => {}, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({
    cover: {},
  })

  const request = (data) => {
    const url = `${API.users}/${user.id}/cover`
    setLoading(true)
    setSuccess(false)
    setError(false)

    fetch(url, {
      method: 'PUT',
      body: data,
    })
      .then((result) => {
        setLoading(false)
        setSuccess(true)
        setError(false)
        onChange()
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError('Error updating your profile cover')
      })
  }

  // Avatar file upload
  const fileInputRef = createRef()

  const openFileDialog = () => {
    fileInputRef.current.click()
  }

  const onImageChanged = (ev) => {
    ev.preventDefault()
    const files = ev.target.files

    var formData = new FormData()

    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append(`profileCover`, files[i])
      }
    } else {
      return
    }

    var reader = new FileReader()

    reader.onload = function (e) {
      setFields({
        cover: {
          path: e.target.result,
        },
      })
    }

    reader.readAsDataURL(files[0])

    request(formData)
  }

  // Set default data
  useEffect(() => {
    setFields({
      cover: user.profile.cover || {},
    })
  }, [user])

  return (
    <>
      <div className="change-profile-cover">
        <div className="input-group">
          <label>Cover image</label>
          <p>Click on the image to change it</p>
          <div className="field" onClick={openFileDialog}>
            <img
              style={{ height: '200px', cursor: 'pointer' }}
              src={fields.cover.path || '/static/demo-images/cover/clouds.jfif'}
            />
          </div>

          <input
            ref={fileInputRef}
            className="fileinput-avatar"
            type="file"
            onChange={onImageChanged}
          />

          <div className="info">
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading...</div>}
            {success && (
              <div className="success-message">
                Cover image successfuly updated
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .fileinput-avatar {
            display: none;
          }

          .actions {
            padding-top: var(--edge-gap);
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
