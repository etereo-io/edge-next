import React, { Fragment, memo } from 'react'
import {
  usePermission,
  useUser,
} from '@lib/client/hooks'

import API from '@lib/api/api-endpoints'
import Layout from '@components/layout/admin/layout-admin'
import { StatisticResponse } from '@lib/types'
import { Widget } from '@components/statistic'
import fetcher from '@lib/fetcher'
import { format } from 'timeago.js'
import useSWR from 'swr'

function AdminPage() {
  const { user } = useUser({ redirectTo: '/home' })

  const { data, isValidating } = useSWR<StatisticResponse>(
    API.statistic,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )
  const { available } = usePermission([`admin.stats`], '/')

  const usersData = data?.data.users || []
  const contentData = data?.data.content || []
  const groupsData = data?.data.groups || []

  
  return (
    <>
      <Layout title="Stats" loading={!available || !user || isValidating}>
        <header className="admin-title">
          <h1>Administration</h1>
          <small className="login-date">
            Last login: {format(user?.metadata.lastLogin)}
          </small>
        </header>
      
        <section className="stats-panel">
          {usersData.map((item) => (
            <Fragment key={item.title}>
              <Widget data={item} />
            </Fragment>
          ))}
          {contentData.map((item) => (
            <Fragment key={item.title}>
              <Widget data={item} />
            </Fragment>
          ))}
          {groupsData.map((item) => (
            <Fragment key={item.title}>
              <Widget data={item} />
            </Fragment>
          ))}
        </section>

        
      </Layout>

      <style jsx>{`
        .admin-title {
          align-items: center;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .admin-title .login-date {
          color: var(--accents-5);
          font-size: 12px;
        }

        h1 {
          font-size: 23px;
          font-weight: 500;
        }

        @media all and (max-width: 720px) {
          h1 {
            font-size: 16px;
          }
        }

        .stats-panel {
          align-items: start;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 40px 0 24px;
        }

        
      `}</style>
    </>
  )
}

export default memo(AdminPage)
