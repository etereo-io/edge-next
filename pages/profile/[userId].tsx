import { Tabs, useTab } from '@components/generic/tabs'
import { useContentTypes, useGroupTypes, useUser } from '@lib/client/hooks'
import { useEffect, useMemo } from 'react'

import Button from '@components/generic/button/button'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import CoverImage from '@components/user/cover-image/cover-image'
import GroupListView from '@components/groups/read/group-list-view/group-list-view'
import Layout from '@components/layout/three-panels/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import ToolBar from '@components/generic/toolbar/toolbar'
import UserActivity from '@components/user/activity/activity'
import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import config from '@lib/config'
import fetch from '@lib/fetcher'
import select from '@components/generic/select/select'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { userPermission } from '@lib/permissions'

const Profile = () => {
  const router = useRouter()
  const { userId, selectedTab = 'post' } = router.query

  const visibleContentTypes = useContentTypes(['read', 'admin'])

  const visibleGroupTypes = useGroupTypes(['read', 'admin'])

  // Check permissions to read
  const currentUser = useUser()

  const hasPermissionsToRead = userPermission(currentUser.user, 'read', userId)
  const hasPermissionsToEdit = userPermission(
    currentUser.user,
    'update',
    userId
  )

  // Load profile data
  const { data, error } = useSWR(userId ? `/api/users/${userId}` : null, fetch)
  const finished = Boolean(data) || Boolean(error)

  const canAccess = hasPermissionsToRead
  const canEdit = hasPermissionsToEdit

  useEffect(() => {
    if (finished && currentUser.finished) {
      if (!data || !canAccess) {
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [data, canAccess, finished, currentUser])

  const canSeeContent = useMemo(
    () => finished && currentUser.finished && canAccess && data,
    [finished, currentUser, canEdit, data]
  )

  const { value: tab, setValue: setTab, onChange: handleTabChange } = useTab(
    selectedTab as string
  )

  useEffect(() => {
    setTab(selectedTab as string)
  }, [selectedTab])

  const tabs = useMemo(() => {
    return [
      ...visibleContentTypes.map((record) => ({
        id: record.slug,
        label: record.title,
        show: canSeeContent,
        content: (
          <ContentListView
            infiniteScroll={false}
            type={record}
            query={`author=${data?.id || null}`}
          />
        ),
      })),
      {
        id: 'groups',
        label: 'Groups',
        show: canSeeContent,
        content: visibleGroupTypes.map((groupType) => {
          return (
            <GroupListView
              infiniteScroll={false}
              type={groupType}
              query={`member=${data?.id || null}`}
            />
          )
        }),
      },
      {
        id: 'likes',
        label: 'Likes',
        show: canSeeContent && config?.like?.enabled,
        content: 'The likes',
      },
      {
        id: 'activity',
        label: 'Activity',
        show: canSeeContent && config?.activity.enabled,
        content: <UserActivity user={data} />,
      },
    ]
  }, [visibleContentTypes, canSeeContent, config, data])

  return (
    <Layout title="Profile" panelUser={<ToolBar />}>
      {!canSeeContent ? (
        <LoadingPage />
      ) : (
        <div className="profile-wrapper">
          <CoverImage user={data} />
          <div className="profile-user-info">
            <UserProfileBox user={data} horizontal={true} />

            <div className="profile-edit">
              {canEdit && (
                <div className="item">
                  <Button alt href={`/settings/${data?.id || ''}`}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="content-container">
            <div className="content-types">
              <Tabs tabs={tabs} onChange={handleTabChange} value={tab} />
            </div>
          </div>
        </div>
      )}

      <style jsx>
        {`
          .profile-wrapper {
            background: var(--edge-background);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            overflow: hidden;
          }
          .profile-user-info {
            align-items: flex-start;
            display: flex;
            flex-wrap: wrap;
            margin: 60px auto 0;
            max-width: 600px;
            padding: 0 var(--edge-gap-medium);
            position: relative;
            width: 100%;
          }

          .profile-edit {
            position: absolute;
            top: -60px;
            transform: translateY(-50%);
            right: var(--edge-gap-half);
          }

          @media (max-width: 720px) {
            .profile-wrapper {
              border-top-left-radius: 0;
              border-top-right-radius: 0;
            }

            .profile-edit {
              position: absolute;
              top: var(--edge-gap-medium-negative);
              transform: translateY(-50%);
              right: var(--edge-gap-half);
            }

            .profile-user-info {
              margin: var(--edge-gap-medium) 0 var(--edge-gap-half) 0;
              padding: 0 var(--edge-gap);
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
