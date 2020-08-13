import { useState, createRef, useEffect } from 'react'
import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import Avatar from '@components/user/avatar/avatar'

export default function Named({ user, onChange = () => {}, ...props }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fields, setFields] = useState({
    picture: {},
  })

  const request = (data) => {
    const url = `${API.users}/${user.id}/picture`

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
        setError('Error updating your profile picture')
      })
  }

  // Avatar file upload
  const fileInputRef = createRef()

  const openFileDialog = () => {
    fileInputRef.current.click()
  }

  const onProfilePictureChanged = (ev) => {
    ev.preventDefault()
    const files = ev.target.files

    var formData = new FormData()

    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append(`profilePicture`, files[i])
      }
    } else {
      return
    }

    var reader = new FileReader()

    reader.onload = function (e) {
      setFields({
        picture: {
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
      picture: user.profile.picture || {},
    })
  }, [user])

  return (
    <>
      <div className="change-profile-picture">
        <div className="input-group">
          <label>Profile Picture</label>
          <p>Click on the image to change it</p>
          <div className="field" onClick={openFileDialog}>
            <Avatar src={fields.picture.path} title={`${user ? user.username: ''} avatar`}/>
          </div>

          <input
            ref={fileInputRef}
            className="fileinput-avatar"
            type="file"
            onChange={onProfilePictureChanged}
          />

          <div className="info">
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading...</div>}
            {success && (
              <div className="success-message">Avatar successfuly updated</div>
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
