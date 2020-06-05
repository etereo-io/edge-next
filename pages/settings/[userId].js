import { useEffect, useState } from 'react'

import DeleteAccountForm from '@components/user/edit-user/delete-account/delete-account'
import EditCoverImageForm from '@components/user/edit-user/edit-profile-picture/edit-cover-image'
import EditDisplayNameForm from '@components/user/edit-user/edit-displayname/edit-displayname'
import EditEmailForm from '@components/user/edit-user/edit-email/edit-email'
import EditPasswordForm from '@components/user/edit-user/edit-password/edit-password'
import EditProfileForm from '@components/user/edit-user/edit-profile/edit-profile'
import EditProfilePictureForm from '@components/user/edit-user/edit-profile-picture/edit-profile-picture'
import EditUsernameForm from '@components/user/edit-user/edit-username/edit-username'
import Layout from '@components/layout/normal/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import { useUser } from '@lib/client/hooks'
import { userPermission } from '@lib/permissions'

const UserSettings = () => {
  //Profile Tabs
  const [activeTab, setActiveTab] = useState('account')
  const onClickTab = (name) => {
    setActiveTab(name)
  }

  // Check if the logged in user can access to this resource
  const router = useRouter()
  const { userId } = router.query

  // Check permissions to read
  const currentUser = useUser()
  const hasPermissionsToEdit = userPermission(currentUser.user, 'update', userId)

  // Load profile data
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Load user, just one time when accesing.
  useEffect(() => {
    if (userId) {
      setLoading(true)
      fetch(`/api/users/` + userId)
        .then((result) => {
          setUser(result)
          setLoading(false)
          setError(false)
        })
        .catch((err) => {
          setUser(null)
          setLoading(false)
          setError(true)
        })
    }
  }, [userId])

  const canAccess = hasPermissionsToEdit 

  useEffect(() => {
    if (!loading && currentUser.finished && (user || error)) {
      if (error || !canAccess) {
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [user, canAccess, loading, error, currentUser])

  // Loading
  if (loading || !currentUser.finished || !canAccess || !user) {
    return (
      <Layout title="Profile">
        <LoadingPage />
      </Layout>
    )
  }

  return (
    <Layout title="User Settings" hasDivider={true}>
      <section className="user-profile-settings-wr">
        <div className="user-profile-view">
          <div className="cover">
            {user.profile.cover && <img src={user.profile.cover.path} />}
          </div>
          <div className="user-profile-view-content">
            <div className="user-profile-box-wrapper">
              <UserProfileBox user={user} />
            </div>
          </div>
        </div>

        <div className="user-profile-configuration-wr">
          <ul className="navigation">
            <li
              onClick={() => onClickTab('account')}
              className={`${activeTab === 'account' ? 'active' : ''}`}
            >
              <a>Account</a>
            </li>
            <li
              onClick={() => onClickTab('profile')}
              className={`${activeTab === 'profile' ? 'active' : ''}`}
            >
              <a>Profile</a>
            </li>
            <li
              onClick={() => onClickTab('password')}
              className={`${activeTab === 'password' ? 'active' : ''}`}
            >
              <a>Password</a>
            </li>
            <li
              onClick={() => onClickTab('activity')}
              className={`${activeTab === 'activity' ? 'active' : ''}`}
            >
              <a>Activity</a>
            </li>
          </ul>

          <div
            className={`${
              activeTab === 'account'
                ? 'navigation-tab active'
                : 'navigation-tab'
            }`}
          >
            <EditProfilePictureForm user={user} />
            <EditCoverImageForm user={user} />
            <EditUsernameForm user={user} />
            <EditDisplayNameForm user={user} />
            <EditEmailForm user={user} />
            <DeleteAccountForm user={user} />
          </div>

          <div
            className={`${
              activeTab === 'profile'
                ? 'navigation-tab active'
                : 'navigation-tab'
            }`}
          >
            <EditProfileForm user={user} />
          </div>

          <div
            className={`${
              activeTab === 'password'
                ? 'navigation-tab active'
                : 'navigation-tab'
            }`}
          >
            <EditPasswordForm user={user} />
          </div>

          <div
            className={`${
              activeTab === 'activity'
                ? 'navigation-tab active'
                : 'navigation-tab'
            }`}
          >
            <UserActivity user={user} />
          </div>
        </div>
      </section>
      <style jsx>
        {`
          .user-profile-settings-wr {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
            max-width: 960px;
            width: 100%;
          }

          .user-profile-view {
            background: var(--edge-background);
            border-radius: 4px;
            box-shadow: var(--shadow-small);
            overflow: hidden;
            position: relative;
            width: 35%;
          }

          .user-profile-view .cover {
          }

          .user-profile-view .cover img {
            max-width: 100%;
          }

          .user-profile-view-content {
            padding: var(--edge-gap-double);
          }

          .user-profile-configuration-wr {
            background: var(--edge-background);
            border-radius: 4px;
            box-shadow: var(--shadow-small);
            width: 60%;
          }

          .navigation {
            background: var(--edge-background);
            border-bottom: 1px solid var(--accents-2);
            display: flex;
            justify-content: space-between;
            padding: var(--edge-gap-double);
            padding-bottom: 0;
            position: sticky;
            top: 80px;
            z-index: var(--z-index-minimum);
          }

          .navigation li {
            cursor: pointer;
            height: 100%;
            list-style: none;
            padding-bottom: var(--edge-gap-half);
          }

          .navigation li a {
            color: var(--accents-3);
            font-size: 12px;
            font-weight: 500;
            text-decoration: none;
            text-transform: uppercase;
          }

          .navigation li.active {
            border-bottom: 2px solid var(--edge-foreground);
          }

          .navigation li.active a {
            color: var(--edge-foreground);
          }

          .navigation-tab {
            height: 0;
            opacity: 0;
            overflow: hidden;
            padding: 0;
            transition: opacity 0.65s ease;
          }

          .navigation-tab.active {
            height: auto;
            opacity: 1;
            padding: var(--edge-gap-double);
            transition: opacity 1s ease;
          }

          @media all and (max-width: 720px) {
            .navigation-tab.active {
              padding: var(--edge-gap);
            }
          }

          @media all and (max-width: 460px) {
            .navigation-tab.active {
              padding: var(--edge-gap) 0;
            }
          }

          .settings {
            display: none;
          }

          @media all and (max-width: 820px) {
            .user-profile-view {
              display: none;
            }
            .user-profile-configuration-wr {
              width: 100%;
            }
            .navigation {
              padding-top: var(--edge-gap);
            }
          }
        `}
      </style>
    </Layout>
  )
}

export default UserSettings
