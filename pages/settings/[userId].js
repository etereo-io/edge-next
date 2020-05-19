import { useEffect, useState } from 'react'

import DeleteAccountForm from '@components/user/edit-user/delete-account/delete-account'
import EditDisplayNameForm from '@components/user/edit-user/edit-displayname/edit-displayname'
import EditEmailForm from '@components/user/edit-user/edit-email/edit-email'
import EditPasswordForm from '@components/user/edit-user/edit-password/edit-password'
import EditProfileForm from '@components/user/edit-user/edit-profile/edit-profile'
import EditProfilePictureForm from '@components/user/edit-user/edit-profile-picture/edit-profile-picture'
import EditUsernameForm from '@components/user/edit-user/edit-username/edit-username'
import Layout from '@components/layout/normal/layout'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import { useUser } from '@lib/client/hooks'
import { userPermission } from '@lib/permissions'

const UserSettings = () => {
  // Check if the logged in user can access to this resource
  const router = useRouter()
  const { userId } = router.query

  // Check permissions to read
  const currentUser = useUser()
  const hasPermissionsToEdit = userPermission(currentUser.user, 'update')

  // Load profile data
  const [user, setUser] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Load user, just one time when accesing.
  useEffect(() => {
    if (userId) {
      fetch(`/api/users/` + userId)
        .then((result) => {
          setUser(result)
          setLoaded(true)
        })
        .catch((err) => {
          setUser(null)
          setLoaded(true)
        })
    }
  }, [userId])

  // Loading
  if (!loaded || !currentUser.finished) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  const isOwner = userId === 'me' || (user && user.username === userId)
  const canAccess = hasPermissionsToEdit || isOwner

  if (!user || !canAccess) {
    // Redirect to 404 if the user is not found or doesnt have permissions
    router.push('/404')
  }

  return (
    canAccess && (
      <Layout title="User Settings">
        <div className="user-settings-page">
          <div className="settings">
            <div className="configuration-block">
              <h2>Avatar</h2>
              <div className="form-wrapper">
                <EditProfilePictureForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Username</h2>
              <div className="form-wrapper">
                <EditUsernameForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Your Name</h2>
              <div className="form-wrapper">
                <EditDisplayNameForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Profile Information</h2>
              <div className="form-wrapper">
                <EditProfileForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Email address</h2>
              <div className="form-wrapper">
                <EditEmailForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Change Password</h2>
              <div className="form-wrapper">
                <EditPasswordForm user={user} />
              </div>
            </div>

            <div className="configuration-block">
              <h2>Delete my account</h2>
              <div className="form-wrapper">
                <DeleteAccountForm user={user} />
              </div>
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

            .configuration-block .form-wrapper {
              padding: var(--empz-gap);
            }
          `}
        </style>
      </Layout>
    )
  )
}

export default UserSettings
