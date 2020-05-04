import { usePermission, useUser } from '../../lib/hooks'

import API from '../../lib/api/api-endpoints'
import Avatar from '../../components/user/avatar/avatar'
import Button from '../../components/generic/button/button'
import DynamicField from '../../components/generic/dynamic-field/dynamic-field'
import Layout from '../../components/layout/normal/layout'
import config from '../../lib/config'
import fetch from '../../lib/fetcher'
import { useRouter } from 'next/router'
import { useState } from 'react'

const UserSettings = (props) => {
  const router = useRouter()

  const [error, setError] = useState({})
  const [loading, setLoading] = useState({})
  const [success, setSuccess] = useState({})

  const [profileState, setProfileState] = useState({})


  const { userId } = router.query
  
  const permissions = usePermission(userId ? ['user.update', 'user.admin'] : null, '/', null, (u) => u.id === userId, userId)

  const { user, finished } = useUser({ userId, redirectTo: '/' })

  // Loading
  if ( !finished || !permissions.finished ) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  // Generic field change
  const handleFieldProfileChange = (name) => (value) => {
    
    setProfileState({
      ...profileState,
      [name]: value,
    })
  }

  // On submit method for using in each case
  const onSubmit = (getDataCb, validateData, key, url, apiErrorMessage = 'Error updating data' ) => ev => {
    ev.preventDefault()
    const data = getDataCb(ev)

    if (!validateData(data)) {
      setError({
        [key]: 'Please complete the required fields'
      })

      return
    } else {
      setError({
        [key]: false
      })
    }

    setLoading({
      [key] : true
    })

    setSuccess({
      [key]: false
    })



    fetch(url, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(result => {
      setLoading({
        [key]: false
      })
      setSuccess({
        [key]: true
      })
    })
    .catch((err) => {
      setLoading({
        [key]: false
      })
      setError({
        [key]: apiErrorMessage
      })
    })
  }

  const onSubmitDelete = () => {}

  /* On submit username */
  const onSubmitUsername = onSubmit(
    (ev) => {
      const username = ev.currentTarget.username.value
      return {
        username
      }
    },
    (d) => {
      if (!d.username ) {
        return false
      } 

      if (d.username.length < 3 ) {
        return false
      }

      return true
    },
    'username',
    `${API.users}/${user.id}/username`,
    'Error updating your username'
  )

  /* On submit email */
  const onSubmitEmail = onSubmit(
    (ev) => {
      const email = ev.currentTarget.email.value
      return {
        email
      }
    },
    (d) => {
      if (!d.email ) {
        return false
      } 

      if (d.email.length < 3 ) {
        return false
      }

      return true
    },
    'email',
    `${API.users}/${user.id}/email`,
    'Error updating your email'
  )

  const onSubmitDisplayName = onSubmit(
    (ev) => {
      const displayName = ev.currentTarget.displayName.value
      return {
        displayName
      }
    },
    (d) => {
      if (!d.displayName ) {
        return false
      } 

      if (d.displayName.length < 3 ) {
        return false
      }

      return true
    },
    'displayName',
    `${API.users}/${user.id}/profile`,
    'Error updating your name'
  )

  const onSubmitPassword = onSubmit(
    (ev) => {
      const password = ev.currentTarget.password.value
      const newpassword = ev.currentTarget.newpassword.value
      const rnewpassword = ev.currentTarget.rnewpassword.value
      return {
        password,
        newpassword,
        rnewpassword
      }
    },
    (d) => {
      if (d.newpassword !== d.newpassword) {
        return false
      } 

      if (d.newpassword.length < 8 ) {
        return false
      }

      if (!d.password) {
        return false
      }

      return true
    },
    'password',
    `${API.users}/${user.id}/password`,
    'Error updating your password'
  )

  const onSubmitProfile = onSubmit(
    () => profileState,
    (d) => {
      const valid = true
      config.user.profile.fields.forEach(f => {
        if (f.required && !d[f.name]) {
          valid = false
        }

        if(f.min && d[f.name].length < f.min ) {
          valid = false
        }

        if(f.max && d[f.name].length > f.max ) {
          valid = false
        }
      })
      return valid
    },
    'profile',
    `${API.users}/${user.id}/profile`,
    'Error updating profile data'
  )


  return (
    permissions.available && <Layout title="User Settings">
      <div className="user-settings-page">
        

        <div className="settings">
          <div className="configuration-block">
            <h2>Avatar</h2>
            <div className="block-settings">
              <p>Click on the avatar image to change it</p>
              <div className="field">
                <Avatar src={user ? user.profile.picture : null} />
              </div>
            </div>
          </div>

          <div className="configuration-block">
            <h2>Username</h2>
            <form onSubmit={onSubmitUsername}>
              <div className="block-settings">
                <p>
                  The username is unique and it's used for mentions or to access
                  your profile. Please use 48 characters at maximum.
                </p>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Your username"
                    name="username"
                    defaultValue={user ? user.username : ''}
                  />
                </div>
              </div>
              <div className="actions">
                <div className="info">
                  {error.username && <div className="error-message">{error.username}</div>}
                  {loading.username && <div className="loading-message">Loading...</div>}
                  {success.username && <div className="success-message">Username updated correctly</div>}
                </div>

                <Button loading={loading.username}>Change username</Button>
              </div>
            </form>
          </div>

          <div className="configuration-block">
            <h2>Your Name</h2>
            <form onSubmit={onSubmitDisplayName}>
              <div className="block-settings">
                <p>
                  Please enter your full name, or a display name you are
                  comfortable with. Please use 32 characters at maximum.
                </p>
                <div className="field">
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Your username"
                    defaultValue={user ? user.profile.displayName : ''}
                  />
                </div>
              </div>
              <div className="actions">
                <div className="info">
                  {error.displayName && <div className="error-message">{error.displayName}</div>}
                  {loading.displayName && <div className="loading-message">Loading...</div>}
                  {success.displayName && <div className="success-message">Name updated correctly</div>}
                </div>
                <Button loading={loading.displayName}>Change Your Name</Button>
              </div>
            </form>
          </div>

          <div className="configuration-block">
            <h2>Profile Information</h2>
            <form onSubmit={onSubmitProfile}>
              <div className="block-settings">
                {config.user.profile.fields.map((field) => (
                  <DynamicField
                    key={field.name}
                    field={field}
                    value={profileState[field.name]}
                    onChange={handleFieldProfileChange(field.name)}
                  />
                ))}
              </div>
              <div className="actions">
                <div className="info">
                  {error.profile && <div className="error-message">{error.profile}</div>}
                  {loading.profile && <div className="loading-message">Loading...</div>}
                  {success.profile && <div className="success-message">profile updated correctly</div>}
                </div>

                <Button loading={loading.profile}>Edit information</Button>
              </div>
            </form>
          </div>

          <div className="configuration-block">
            <h2>Email address</h2>
            <form onSubmit={onSubmitEmail}>
              <div className="block-settings">
                <p>A new email will require e-mail validation</p>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    required
                    defaultValue={user ? user.email : ''}
                  />
                </div>
              </div>
              <div className="actions">
                <div className="info">
                  {error.email && <div className="error-message">{error.email}</div>}
                  {loading.email && <div className="loading-message">Loading...</div>}
                  {success.email && <div className="success-message">Email updated correctly. Please check your email inbox to verify your new address.</div>}
                </div>
                <Button loading={loading.email}>Change email</Button>
              </div>
            </form>
          </div>

          <div className="configuration-block">
            <h2>Change Password</h2>
            <form onSubmit={onSubmitPassword}>
              <div className="block-settings">
                <div className="field">
                  <input type="password" name="password" required placeholder="Current Password" />
                </div>
                <div className="field">
                  <input type="password" name="newpassword" required placeholder="New Password" />
                </div>
                <div className="field">
                  <input type="password" name="rnewpassword" required placeholder="Repeat new Password" />
                </div>
              </div>

              <div className="actions">
                <div className="info">
                  {error.password && <div className="error-message">{error.password}</div>}
                  {loading.password && <div className="loading-message">Loading...</div>}
                  {success.password && <div className="success-message">password updated correctly</div>}
                </div>
                <Button loading={loading.password}>Update</Button>
              </div>
            </form>
          </div>

          <div className="configuration-block">
            <h2>Delete my account</h2>
            <form onSubmit={onSubmitDelete} >
              <div className="block-settings">
                <p>
                  <strong>Warning</strong>, this action can not be undone
                </p>
                <div className="field">
                  <input type="password" name="password" placeholder="Password" />
                </div>
              </div>

              <div className="actions">
                <div className="info">
                  {error.delete && <div className="error-message">{error.delete}</div>}
                  {loading.delete && <div className="loading-message">Loading...</div>}
                  {success.delete && <div className="success-message">Your account was deleted. You will be redirected shortly</div>}
                </div>
                <Button loading={loading.delete}>Delete</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .user-settings-page {
            display: flex;
            flex-wrap: wrap;
          }

          .menu {
            width: 200px;
          }

          .configuration-block {
            border-radius: var(--empz-radius);
            overflow: hidden;

            margin-bottom: var(--empz-gap-double);
            background: var(--accents-2);
          }

          .configuration-block h2 {
            display: block;
            padding: var(--empz-gap);
            background: var(--empz-foreground);
            color: var(--empz-background);
            margin-bottom: var(--empz-gap);
          }

          .configuration-block .block-settings {
            padding: var(--empz-gap);
          }

          .configuration-block .block-settings p {
            margin-bottom: var(--empz-gap);
          }

          .configuration-block .actions {
            padding: var(--empz-gap);
            display: flex;
            justify-content: flex-end;
          }

          .configuration-block .info {
            padding: var(--empz-gap);
          }

        `}
      </style>
    </Layout>
  )
}

export default UserSettings
