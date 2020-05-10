import { createRef, useEffect, useReducer } from 'react'

import API from '../../lib/api/api-endpoints'
import Avatar from '../../components/user/avatar/avatar'
import Button from '../../components/generic/button/button'
import DynamicField from '../../components/generic/dynamic-field/dynamic-field-edit'
import Layout from '../../components/layout/normal/layout'
import PasswordStrength from '../../components/generic/password-strength/password-strength'
import config from '../../lib/config'
import fetch from '../../lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useUser } from '../../lib/hooks'
import { userPermission } from '../../lib/permissions'

const reducer = (state, action) => {
  
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      const { picture, displayName, ...profile } = action.payload.profile
      const { username, email } = action.payload

      return {
        ...state,
        seeded: true,
        username: {
          value: username
        },
        email: {
          value: email
        },

        displayName: {
          value: displayName
        },
        
        avatar: {
          value: picture
        },

        profile: {
          value: profile
        }

      }

    case 'UPDATE_FIELD': 
      return {
        ...state,
        [action.field]: {
            ...state[action.field],
            value: action.payload,
          }
        }
      
      
    case 'UPDATE_PROFILE_FIELD': 
      return {
        ...state,
        profile: {
          ...state.profile,
          value: {
            ...state.profile.value || {},
            [action.field]: action.payload,
          }
        },
      }
    
    case 'SET_VALIDATION_ERROR': 
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          error: action.payload
        }
      }

    case 'SAVE_FIELD':
      return {
        ...state, 
        [action.field]: {
          ...state[action.field],
          loading: true,
          error: false,
          success: false
        }
      }
    case 'SAVE_FIELD_SUCCESS':
        return {
          ...state, 
          [action.field]: {
            ...state[action.field],
            loading: false,
            error: false,
            success: true
          }
        }
    case 'SAVE_FIELD_ERROR':
        return {
          ...state, 
          [action.field]: {
            ...state[action.field],
            loading: false,
            error: action.payload || true,
            success: false
          }
        }

    case 'CLEAR_FIELD_ERROR': 
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          error: false
        }
      }
    
   
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}


const UserSettings = () => {
  
  const [state, dispatch] = useReducer(reducer, {
    username: {},
    avatar: {},
    email: {},
    profile: {
      value: {}
    },
    displayName: {},
    password: {},
    newpassword: {},
    rnewpassword: {},
    deleteAccount: {}
  })

  // Check if the logged in user can access to this resource
  const router = useRouter()
  const { userId } = router.query

  // Check permissions to read
  const currentUser = useUser()
  const canAccess = userPermission(currentUser.user, 'update', userId)
  
  // Load profile data
  const userResponse = useSWR( userId ? `/api/users/` + userId : null, fetch)
  const finished = Boolean(userResponse.data) || Boolean(userResponse.error)
  const user = userResponse.data

  useEffect(() => {
    // Set initial state
    if (user && !state.seeded) {
      dispatch({
        type: 'SET_INITIAL_DATA',
        payload: user,
      })
    }
  }, [user])

  
  // Loading
  if (!finished || !currentUser.finished) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  if (!userResponse.data || !canAccess) {
    // Redirect to 404 if the user is not found or doesnt have permissions
    router.push('/404')
  }


  // Generic field change
  const handleFieldProfileChange = (name) => (value) => {
    dispatch({
      type: 'UPDATE_PROFILE_FIELD',
      field: name,
      payload: value
    })
  }

  const handleFieldChange = (name) => (value) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: name,
      payload: value
    })

    // Field changes clear the error
    dispatch({
      type: 'CLEAR_FIELD_ERROR',
      field: name
    })
  }

  // On submit method for using in each case
  const onSubmit = (
    getDataCb,
    validateData,
    key,
    url,
    apiErrorMessage = 'Error updating data',
    successCallback = () => {}
  ) => (ev) => {
    ev.preventDefault()
    const data = getDataCb(ev)

    if (!validateData(data)) {
      dispatch({
        type: 'SET_VALIDATION_ERROR',
        field: key,
        payload: 'Please complete the required fields'
      })

      return
    } else {
      dispatch({
        type: 'SET_VALIDATION_ERROR',
        field: key,
        payload: false
      })
    }

    dispatch({
      type: 'SAVE_FIELD',
      field: key
    })

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        dispatch({
          type: 'SAVE_FIELD_SUCCESS',
          field: key,
          payload: result
        })
        successCallback()
      })
      .catch((err) => {
        dispatch({
          type: 'SAVE_FIELD_ERROR',
          field: key,
          payload: apiErrorMessage
        })
      })
  }

  const onSubmitDelete = () => {}

  /* On submit username */
  const onSubmitUsername = onSubmit(
    (ev) => {
      const username = ev.currentTarget.username.value
      return {
        username,
      }
    },
    (d) => {
      if (!d.username) {
        return false
      }

      if (d.username.length < 3) {
        return false
      }

      return true
    },
    'username',
    `${API.users}/${user.id}/username`,
    'Error updating your username. This username is already taken.'
  )

  /* On submit email */
  const onSubmitEmail = onSubmit(
    (ev) => {
      const email = ev.currentTarget.email.value
      return {
        email,
      }
    },
    (d) => {
      if (!d.email) {
        return false
      }

      if (d.email.length < 3) {
        return false
      }

      return true
    },
    'email',
    `${API.users}/${user.id}/email`,
    'Error updating your email, this email is already taken.'
  )

  const onSubmitDisplayName = onSubmit(
    (ev) => {
      const displayName = ev.currentTarget.displayName.value
      return {
        displayName,
      }
    },
    (d) => {
      if (!d.displayName) {
        return false
      }

      if (d.displayName.length < 3) {
        return false
      }

      return true
    },
    'displayName',
    `${API.users}/${user.id}/profile`,
    'Error updating your name, please try again later.'
  )

  const onSubmitPassword = onSubmit(
    (ev) => {
      const password = ev.currentTarget.password.value
      const newpassword = ev.currentTarget.newpassword.value
      const rnewpassword = ev.currentTarget.rnewpassword.value
      return {
        password,
        newpassword,
        rnewpassword,
      }
    },
    (d) => {
      if (d.newpassword !== d.newpassword) {
        return false
      }

      if (d.newpassword.length < 6) {
        return false
      }

      return true
    },
    'password',
    `${API.users}/${user.id}/password`,
    'Error updating your password. Make sure you entered correctly your current password.',
    () => {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'password',
        payload: ''
      })
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'newpassword',
        payload: ''
      })
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'rnewpassword',
        payload: ''
      })
    }
  )

  const onSubmitProfile = onSubmit(
    () => state.profile.value,
    (d) => {
      let valid = true
      config.user.profile.fields.forEach((f) => {
        if (f.required && !d[f.name]) {
          valid = false
        }

        if (f.min && d[f.name].length < f.min) {
          valid = false
        }

        if (f.max && d[f.name].length > f.max) {
          valid = false
        }
      })
      return valid
    },
    'profile',
    `${API.users}/${user.id}/profile`,
    'Error updating your profile information. Please try again later.'
  )

  // Avatar file upload
  const fileInputRef = createRef()

  const openFileDialog = () => {
    fileInputRef.current.click()
  }

  const onFilesAdded = (ev) => {

    const files = ev.target.files

    var formData = new FormData();
    
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append(`profilePicture`, files[i])
      }
    } else {
      return
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'avatar',
        payload: e.target.result
      })
    };

    reader.readAsDataURL(files[0]);

    dispatch({
      type: 'SAVE_FIELD',
      field: 'avatar'
    })

    fetch(`${API.users}/${user.id}/picture`, {
      method: 'PUT',
      body: formData,
    })
    .then(() => {
      dispatch({
        type: 'SAVE_FIELD_SUCCESS',
        field: 'avatar'
      })
    })
    .catch(err => {
      dispatch({
        type: 'SAVE_FIELD_ERROR',
        field: 'avatar'
      })
    })
  }

  return (
    canAccess && (
      <Layout title="User Settings">
        <div className="user-settings-page">
          <div className="settings">
            <div className="configuration-block">
              <h2>Avatar</h2>
              <div className="block-settings">
                <p>Click on the avatar image to change it</p>
                <div className="field" onClick={openFileDialog}>
                  <Avatar src={state.avatar.value} />
                </div>

                <input
                  ref={fileInputRef}
                  className="fileinput-avatar"
                  type="file"
                  onChange={onFilesAdded}
                />

                <div className="info">
                    {state.avatar.error && (
                      <div className="error-message">Error while updating your profile picture.</div>
                    )}
                    {state.avatar.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.avatar.success && (
                      <div className="success-message">
                        Avatar successfuly updated
                      </div>
                    )}
                  </div>
              </div>
            </div>

            <div className="configuration-block">
              <h2>Username</h2>
              <form onSubmit={onSubmitUsername}>
                <div className="block-settings">
                  <p>
                    The username is unique and it's used for mentions or to
                    access your profile. Please use 48 characters at maximum.
                  </p>
                  <div className={`input-group required ${state.username.error ? 'error': ''}`}>
                    <input
                      type="text"
                      placeholder="Your username"
                      name="username"
                      onChange={(ev) => handleFieldChange('username')(ev.target.value)}
                      value={state.username.value}
                    />
                  </div>
                </div>
                <div className="actions">
                  <div className="info">
                    {state.username.error && (
                      <div className="error-message">{state.username.error}</div>
                    )}
                    {state.username.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.username.success && (
                      <div className="success-message">
                        Username updated correctly
                      </div>
                    )}
                  </div>

                  <Button loading={state.username.loading}>Change username</Button>
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
                  <div className={`input-group required ${state.displayName.error ? 'error': ''}`}>
                    <input
                      type="text"
                      name="displayName"
                      placeholder="Your username"
                      onChange={(ev) => handleFieldChange('displayName')(ev.target.value)}
                      value={state.displayName.value}
                    />
                  </div>
                </div>
                <div className="actions">
                  <div className="info">
                    {state.displayName.error && (
                      <div className="error-message">{state.displayName.error}</div>
                    )}
                    {state.displayName.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.displayName.success && (
                      <div className="success-message">
                        Name updated correctly
                      </div>
                    )}
                  </div>
                  <Button loading={state.displayName.loading}>
                    Change Your Name
                  </Button>
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
                      value={state.profile.value[field.name]}
                      onChange={handleFieldProfileChange(field.name)}
                    />
                  ))}
                </div>
                <div className="actions">
                  <div className="info">
                    {state.profile.error && (
                      <div className="error-message">{state.profile.error}</div>
                    )}
                    {state.profile.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.profile.success && (
                      <div className="success-message">
                        profile updated correctly
                      </div>
                    )}
                  </div>

                  <Button loading={state.profile.loading}>Edit information</Button>
                </div>
              </form>
            </div>

            <div className="configuration-block">
              <h2>Email address</h2>
              <form onSubmit={onSubmitEmail}>
                <div className="block-settings">
                  <p>A new email will require e-mail validation</p>
                  <div className={`input-group required ${state.email.error ? 'error': ''}`}>
                    <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      required
                      onChange={(ev) => handleFieldChange('email')(ev.target.value)}
                      value={state.email.value}
                    />
                  </div>
                </div>
                <div className="actions">
                  <div className="info">
                    {state.email.error && (
                      <div className="error-message">{state.email.error}</div>
                    )}
                    {state.email.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.email.success && (
                      <div className="success-message">
                        Email updated correctly. Please check your email inbox
                        to verify your new address.
                      </div>
                    )}
                  </div>
                  <Button loading={state.email.loading}>Change email</Button>
                </div>
              </form>
            </div>

            <div className="configuration-block">
              <h2>Change Password</h2>
              <form onSubmit={onSubmitPassword}>
                <div className="block-settings">
                  <div className="input-group required">
                    <input
                      type="password"
                      name="password"
                      onChange={(ev) => handleFieldChange('password')(ev.target.value)}
                      value={state.password.value}
                      placeholder="Current Password"
                    />
                  </div>
                  <div className="input-group required">
                    <input
                      type="password"
                      name="newpassword"
                      required
                      onChange={(ev) => {
                        handleFieldChange('newpassword')(ev.target.value)
                        // Field changes clear the error
                        dispatch({
                          type: 'CLEAR_FIELD_ERROR',
                          field: 'password'
                        })
                      }}
                      value={state.newpassword.value}
                      placeholder="New Password"
                    />
                  </div>
                  <div className="input-group required">
                    <input
                      type="password"
                      name="rnewpassword"
                      required
                      onChange={(ev) => {
                        handleFieldChange('rnewpassword')(ev.target.value)
                        // Field changes clear the error
                        dispatch({
                          type: 'CLEAR_FIELD_ERROR',
                          field: 'password'
                        })
                      }}
                      value={state.rnewpassword.value}
                      placeholder="Repeat new Password"
                    />

                    <PasswordStrength password={state.newpassword.value} />
                  </div>
                </div>

                <div className="actions">
                  <div className="info">
                    {state.newpassword.value !== state.rnewpassword.value && (
                      <div className="error-message">Passwords do not match</div>
                    )}
                    {state.newpassword.value && state.newpassword.value.length < 6 && state.password.error && (
                      <div className="error-message">Password should be at least 6 characters long.</div>
                    )}
                    {state.password.error && (
                      <div className="error-message">{state.password.error}</div>
                    )}
                    {state.password.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.password.success && (
                      <div className="success-message">
                        password updated correctly
                      </div>
                    )}
                  </div>
                  <Button loading={state.password.loading}>Update</Button>
                </div>
              </form>
            </div>

            <div className="configuration-block">
              <h2>Delete my account</h2>
              <form onSubmit={onSubmitDelete}>
                <div className="block-settings">
                  <p>
                    <strong>Warning</strong>, this action can not be undone
                  </p>
                  <div className="field">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="actions">
                  <div className="info">
                    {state.deleteAccount.error && (
                      <div className="error-message">{state.deleteAccount.error}</div>
                    )}
                    {state.deleteAccount.loading && (
                      <div className="loading-message">Loading...</div>
                    )}
                    {state.deleteAccount.success && (
                      <div className="success-message">
                        Your account was deleted. You will be redirected shortly
                      </div>
                    )}
                  </div>
                  <Button loading={state.deleteAccount.loading}>Delete</Button>
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

            .fileinput-avatar {
              display: none;
            }
    
          `}
        </style>
      </Layout>
    )
  )
}

export default UserSettings
