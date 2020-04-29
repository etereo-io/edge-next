import API from '../../lib/api/api-endpoints'
import Avatar from '../../components/user/avatar/avatar'
import Button from '../../components/generic/button/button'
import DropdownMenu from '../../components/generic/dropdown-menu/dropdown-menu'
import Layout from '../../components/layout/normal/layout'
import config from '../../lib/config'
import fetch from '../../lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useState } from 'react'

const UserSettings = (props) => {
  console.log(props)

  const [error, setError] = useState({})
  const [loading, setLoading] = useState({})
  const [success, setSuccess] = useState({})


  const router = useRouter()
  const { userId } = router.query
  
  // const available = usePermission(`user.read`, '/', 'slug')
  // TODO : add permissions to access

  /* Fetch initial data */
  const response = useSWR(
    userId ? `${API.users}/${userId}` : null,
    fetch,
    { initialData: null }
  )

  const finished = Boolean(response.data) || Boolean(response.error)
  
  // Loading or 404 
  if (!finished || !response.data) {
    return (
      <Layout title="UserSettings">
        <h1>User Settings</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  /* On submit username */
  const onSubmitUsername = (ev) => {
    ev.preventDefault()
    const data = ev.currentTarget.username.value

    if (!data) {
      setError({
        ...error,
        username: 'Please fill in a username'
      })
    } else {
      setLoading({
        username: true
      })
      setSuccess({
        username: false
      })
      setError({
        username: false
      })


      const url = `${API.users}/${user.id}/username`
      fetch(url, {
        method: 'put',
        body: JSON.stringify({
          username: data
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(result => {
        setLoading({
          username: false
        })
        setSuccess({
          username: true
        })
      })
      .catch((err) => {
        setLoading({
          username: false
        })
        setError({
          username: 'Invalid username. Username already exists. '
        })
      })

    }
  }

  /* On submit email */
  const onSubmitEmail = (ev) => {
    ev.preventDefault()
    const data = ev.currentTarget.email.value

    if (!data) {
      setError({
        ...error,
        email: 'Please fill in a email'
      })
    } else {
      setLoading({
        email: true
      })
      setSuccess({
        email: false
      })
      setError({
        email: false
      })


      const url = `${API.users}/${user.id}/email`
      fetch(url, {
        method: 'put',
        body: JSON.stringify({
          email: data
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(result => {
        setLoading({
          email: false
        })
        setSuccess({
          email: true
        })
      })
      .catch((err) => {
        setLoading({
          email: false
        })
        setError({
          email: 'Invalid email. email already exists. '
        })
      })

    }
  }

  const onSubmitDelete = () => {}
  const onSubmitDisplayName = () => {}
  const onSubmitPassword = () => {}

  const user = response.data

  return (
    <Layout title="User Settings">
      <div className="user-settings-page">
        <div className="menu">
          <ul>
            <li>Settings</li>
            <li>Oauth</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div className="settings">
          <div className="configuration-block">
            <h2>Avatar</h2>
            <div className="block-settings">
              <p>Click on the avatar image to change it</p>
              <div className="field">
                <Avatar src={user ? user.profile.img : null} />
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
                    name="displayname"
                    placeholder="Your username"
                    defaultValue={user ? user.profile.displayname : ''}
                  />
                </div>
              </div>
              <div className="actions">
                <div className="info">
                  {error.displayname && <div className="error-message">{error.displayname}</div>}
                  {loading.displayname && <div className="loading-message">Loading...</div>}
                  {success.displayname && <div className="success-message">Name updated correctly</div>}
                </div>
                <Button loading={loading.displayname}>Change Your Name</Button>
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
