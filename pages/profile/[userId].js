import { useContentTypes, useUser } from '@lib/client/hooks'

import Button from '@components/generic/button/button'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'
import Layout from '@components/layout/normal/layout'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import config from '@lib/config'
import fetch from '@lib/fetcher'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { userPermission } from '@lib/permissions'

const Profile = (props) => {
  const router = useRouter()
  const { userId } = router.query

  const visibleContentTypes = useContentTypes(['read', 'admin'])

  // Check permissions to read
  const currentUser = useUser()

  const hasPermissionsToRead = userPermission(currentUser.user, 'read')
  const hasPermissionsToEdit = userPermission(currentUser.user, 'update')

  // Load profile data
  const { data, error } = useSWR(userId ? `/api/users/` + userId : null, fetch)
  const finished = Boolean(data) || Boolean(error)

  // Loading
  if (!finished || !currentUser.finished) {
    return (
      <Layout title="Profile">
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  const isOwner = userId === 'me' || (data && data.username === userId)
  const canAccess = hasPermissionsToRead || isOwner
  const canEdit = hasPermissionsToEdit || isOwner

  if (!data || !canAccess) {
    // Redirect to 404 if the user is not found
    router.push('/404')
  }

  return (
    <Layout title="Profile" hasDivider={true}>
      <div className="cover-wrapper">
        <img style={{height: '200px'}} src={data && data.profile.cover ? data.profile.cover.path : '/static/demo-images/cover/clouds.jfif'} />
      </div>
      <div className="profile-user-info">
        <div className="avatar">
          <UserProfileBox user={data} horizontal={true} />
        </div>
        <div className="name">
          <div className="title">
            <div className="title-left"></div>
            <div className="title-right">
              {canEdit && (
                <div className="item">
                  <Button href={`/settings/${data ? data.id : ''}`}>
                    Edit Profile
                  </Button>
                </div>
              )}

              <div className="item">
                <DropdownMenu align={'right'}>
                  <ul>
                    <li>Report</li>
                  </ul>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="dashboar-bar"></div>
        </div>
      </div>

      <div className="content-container">
        <div className="content-types">
          {visibleContentTypes.map((cData) => {
            return (
              <div className="content-block">
                <h3>User's {cData.title}s</h3>
                <ContentListView
                  infiniteScroll={false}
                  type={cData}
                  query={`author=${data ? data.id : null}`}
                />
              </div>
            )
          })}
        </div>

        {config.activity.enabled && (
          <div className="activity-report">
            <h3>Recent activity</h3>
            {data && <UserActivity user={data} />}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .profile-user-info {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 60px;
            align-items: center;
          }

          @media (max-width: 600px) {
            .profile-user-info {
              margin-bottom: var(--empz-gap-half);
            }
          }

          .name {
            flex: 1;
          }

          h3 {
            margin-bottom: var(--empz-gap);
          }

          .title {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: var(--empz-gap);
          }

          .title-right {
            align-items: center;
            display: flex;
          }

          .title-right .item {
            margin-left: var(--empz-gap);
          }

          .content-container {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
          }

          @media (max-width: 900px) {
            .content-container {
              display: block;
              padding: 0;
              margin-top: var(--empz-gap);
            }
          }

          .content-types {
            background: var(--empz-background);
            box-shadow: var(--shadow-small);
            border-radius: 4px;
            margin-right: var(--empz-gap);
            padding: var(--empz-gap-double);
            width: 68%;
          }

          .activity-report {
            background: var(--empz-background);
            box-shadow: var(--shadow-small);
            border-radius: 4px;
            padding: var(--empz-gap-double);
            width: 30%;
          }

          @media (max-width: 900px) {
            .content-types {
              width: 100%;
              padding: var(--empz-gap-half);
            }
          }

          @media (max-width: 600px) {
            .content-types,
            .activity-report {
              flex: 1;
            }
          }

          .content-block {
            margin-bottom: var(--empz-gap-double);
          }

          .content-summary-content {
            padding: var(--empz-gap);
            border-radius: var(--empz-radius);
            background: var(--empz-foreground);
          }
        `}
      </style>
    </Layout>
  )
}

export default Profile
