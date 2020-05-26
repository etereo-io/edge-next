import { useContentTypes, useUser } from '@lib/client/hooks'

import Button from '@components/generic/button/button'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import CoverImage from '@components/user/cover-image/cover-image'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'
import Layout from '@components/layout/three-panels/layout'
import ToolBar from '@components/generic/toolbar/toolbar'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import config from '@lib/config'
import fetch from '@lib/fetcher'
import { useEffect } from 'react'
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

  const isOwner = userId === 'me' || (data && data.username === userId)
  const canAccess = hasPermissionsToRead || isOwner
  const canEdit = hasPermissionsToEdit || isOwner

  useEffect(() => {
    if (finished && currentUser.finished) {
      if (!data || !canAccess) {
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [data, canAccess, finished, currentUser])

  // Loading
  if (!finished || !currentUser.finished || !canAccess || (finished && !data)) {
    return (
      <Layout title="Profile" >
        <h1>Profile</h1>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout title="Profile" panelUser={<ToolBar />}>
      <div className="profile-wrapper">
        <CoverImage user={data} />
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
                  <ContentListView
                    infiniteScroll={false}
                    type={cData}
                    query={`author=${data ? data.id : null}`}
                  />
                </div>
              )
            })}
          </div>
{/*
          {config.activity.enabled && (
            <div className="activity-report">
              <h3>Recent activity</h3>
              {data && <UserActivity user={data} />}
            </div>
          )}*/}
        </div>
      </div>
      <style jsx>
        {`
          .profile-user-info {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            margin: var(--edge-gap-double) auto 60px;
            max-width: 600px;
            width: 100%;
          }

          @media (max-width: 600px) {
            .profile-user-info {
              margin-bottom: var(--edge-gap-half);
            }
          }

          .name {
            flex: 1;
          }

          h3 {
            margin-bottom: var(--edge-gap);
          }

          .title {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: var(--edge-gap);
          }

          .title-right {
            align-items: center;
            display: flex;
          }

          .title-right .item {
            margin-left: var(--edge-gap);
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
              margin-top: var(--edge-gap);
            }
          }

          .content-types {
            border-radius: 4px;
            margin: 0 auto;
            max-width: 600px;
            width: 100%;
          }

          .activity-report {
            background: var(--edge-background);
            box-shadow: var(--shadow-small);
            border-radius: 4px;
            padding: var(--edge-gap-double);
            width: 30%;
          }

          @media (max-width: 900px) {
            .content-types {
              width: 100%;
            }
          }

          @media (max-width: 600px) {
            .content-types,
            .activity-report {
              flex: 1;
            }
          }

          .content-block {
            margin-bottom: var(--edge-gap-double);
          }

          .content-summary-content {
            padding: var(--edge-gap);
            border-radius: var(--edge-radius);
            background: var(--edge-foreground);
          }
        `}
      </style>
    </Layout>
  )
}

export default Profile
