import { Tabs, useTab } from '@components/generic/tabs'
import { hasPermission, userPermission } from '@lib/permissions'
import { useEffect, useMemo } from 'react'
import useSWR, { mutate } from 'swr'

import DeleteAccountForm from '@components/user/edit-user/delete-account/delete-account'
import EditCoverImageForm from '@components/user/edit-user/edit-profile-picture/edit-cover-image'
import EditDisplayNameForm from '@components/user/edit-user/edit-displayname/edit-displayname'
import EditEmailForm from '@components/user/edit-user/edit-email/edit-email'
import EditPasswordForm from '@components/user/edit-user/edit-password/edit-password'
import EditProfileForm from '@components/user/edit-user/edit-profile/edit-profile'
import EditProfilePictureForm from '@components/user/edit-user/edit-profile-picture/edit-profile-picture'
import EditRolesForm from '@components/user/edit-user/edit-roles'
import EditUsernameForm from '@components/user/edit-user/edit-username/edit-username'
import Layout from '@components/layout/normal/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import { useUser } from '@lib/client/hooks'

const UserSettings = () => {
  // Check if the logged in user can access to this resource
  const router = useRouter()
  const { userId } = router.query

  // Check permissions to read
  const currentUser = useUser()
  const hasPermissionsToEdit = userPermission(
    currentUser.user,
    'update',
    userId
  )

  const isAdmin = hasPermission(currentUser.user, 'user.admin')


  const { data: user, error } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetch
  )

  const canAccess = hasPermissionsToEdit

  const canSeeContent = useMemo(
    () => currentUser.finished && canAccess && user,
    [ currentUser, canAccess, user]
  )

  const { value: tab, onChange: handleTabChange } = useTab('account')

  const mutateUser = () => {
    mutate( `/api/users/${userId}`)
  }

  const tabs = useMemo(
    () => [
      {
        id: 'account',
        label: 'Account',
        show: canSeeContent,
        content: (
          <>
            <EditProfilePictureForm user={user} onChange={mutateUser} />
            <EditCoverImageForm user={user} onChange={mutateUser} />
            <EditUsernameForm user={user} onChange={mutateUser} />
            <EditDisplayNameForm user={user} onChange={mutateUser}/>
            <EditEmailForm user={user} onChange={mutateUser} />
            {isAdmin && <EditRolesForm user={user} onChange={mutateUser} />}
            <DeleteAccountForm user={user}/>
          </>
        ),
      },
      {
        id: 'profile',
        label: 'Profile',
        show: canSeeContent,
        content: <EditProfileForm user={user} currentUser={currentUser?.user} onChange={mutateUser} />,
      },
      {
        id: 'password',
        label: 'Password',
        show: canSeeContent,
        content: <EditPasswordForm user={user} />,
      },
      {
        id: 'activity',
        label: 'Activity',
        show: canSeeContent,
        content: <UserActivity user={user} />,
      },
    ],
    [user, canSeeContent]
  )

  useEffect(() => {
    if ( currentUser.finished && (user || error)) {
      if (error || !canAccess) {
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [user, canAccess, error, currentUser])

  return (
    <Layout title="User Settings" hasDivider={true}>
      {!canSeeContent ? (
        <LoadingPage />
      ) : (
        <section className="user-profile-settings-wr">
          <div className="user-profile-view">
            <div className="cover">
              {user.profile.cover && <img src={user.profile.cover.path} alt="cover"/>}
            </div>
            <div className="user-profile-view-content">
              <div className="user-profile-box-wrapper">
                <UserProfileBox user={user} />
              </div>
            </div>
          </div>
          <div className="user-profile-configuration-wr">
            <Tabs tabs={tabs} value={tab} onChange={handleTabChange} />
          </div>
        </section>
      )}

      <style jsx>
        {`
          .user-profile-settings-wr {
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

          @media all and (max-width: 820px) {
            .user-profile-view {
              display: none;
            }
            .user-profile-configuration-wr {
              width: 100%;
            }
          }
        `}
      </style>
    </Layout>
  )
}

export default UserSettings
