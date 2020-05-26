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
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { userPermission } from '@lib/permissions'

const Profile = (props) => {
  //Profile Tabs
  const [activeTab, setActiveTab] = useState('account')
  const onClickTab = (name) => {
    setActiveTab(name)
  }
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
      <Layout title="Profile">
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
          <UserProfileBox user={data} horizontal={true} />

          <div className="profile-edit">
            {canEdit && (
              <div className="item">
                <Button href={`/settings/${data ? data.id : ''}`}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="content-container">
          <div className="content-types">
            <ul className="navigation">
              <li
                onClick={() => onClickTab('posts')}
                className={`${activeTab === 'posts' ? 'active' : ''}`}
              >
                <a>Posts</a>
              </li>
              <li
                onClick={() => onClickTab('comments')}
                className={`${activeTab === 'comments' ? 'active' : ''}`}
              >
                <a>Comments</a>
              </li>
              <li
                onClick={() => onClickTab('likes')}
                className={`${activeTab === 'likes' ? 'active' : ''}`}
              >
                <a>Likes</a>
              </li>
            </ul>
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
            align-items: flex-start;
            display: flex;
            flex-wrap: wrap;
            margin: 60px auto;
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
        `}
      </style>
    </Layout>
  )
}

export default Profile
