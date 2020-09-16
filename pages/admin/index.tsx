import React, { memo, Fragment } from 'react'
import { format } from 'timeago.js'
import useSWR from 'swr'

import { usePermission, useUser } from '@lib/client/hooks'
import Layout from '@components/layout/admin/layout-admin'
import fetcher from '@lib/fetcher'
import API from '@lib/api/api-endpoints'
import { StatisticResponse } from '@lib/types'
import { Widget } from '@components/statistic'

function AdminPage() {
  const { user } = useUser({ redirectTo: '/' })

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

        <section className="stats-quick-view">
          <div className="stats-unit">
            <b className="title">Users</b>
          </div>
        </section>
      </Layout>

      <style global jsx>{`
        .admin-title  {
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

        .stats-unit {
          align-items: center;
          background: var(--edge-background);
          border-radius: 8px;
          box-shadow: var(--shadow-smallest);
          display: flex;
          justify-content: space-between;
          padding: 24px;
          position: relative;
          transition: box-shadow 0.35s ease-in, transform 0.35s ease-in;
          width: 23%;
        }

        .stats-unit-view  {
          align-items: center;
          display: flex;
        }

        @media all and (max-width: 600px) {
          .stats-unit  {
            margin-bottom: 16px;
            width: calc(50% - 16px);
          }
        }

        .stats-panel .stats-unit:hover {
          box-shadow: var(--shadow-hover);
          transform: scale(1.025);
        }

        .stats-unit-data {
          display: block;
          font-size: 23px;
        }

        .stats-unit-title {
          color: var(--accents-4);
          display: block;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
        }

        .stats-unit-percentage {
          align-items: center;
          background: var(--edge-success-soft);
          border-radius: 8px;
          display: flex;
          font-size: 14px;
          font-weight: 600;
          padding: 0;
          margin-right: 8px;
          justify-content: center;
          height: 48px;
          width: 48px;
        }

        @media all and (max-width: 990px) {
          .stats-unit-percentage  {
            height: 36px;
            width: 36px;
          }
        }

        @media all and (max-width: 960px) {
          .stats-unit {
            padding: 16px;
          }
          .stats-unit-increase {
            font-size: 12px;
            position: absolute;
            top: 4px;
            right: 8px;
          }
        }

        @media all and (min-width: 600px) and (max-width: 760px) {
          .stats-unit-percentage  {
            height: 24px;
            width: 24px;
          }

          .stats-unit-data {
            font-size: 21px;
          }

          .stats-unit-title {
            font-size: 12px;
          }
        }

        .stats-unit-increase {
          color: var(--edge-success);
        }

        .stats-unit.minus .stats-unit-percentage {
          background: var(--edge-error-soft);
        }

        .stats-unit.minus .stats-unit-increase {
          color: var(--edge-error);
        }

        .stats-quick-view {
          display: flex;
          justify-content: space-between;
        }

        .stats-quick-view .stats-unit {
          align-items: start;
        }

        .stats-quick-view .stats-unit .title {
          font-size: 12px;
          text-transform: uppercase;
        }

        .stats-quick-view .stats-unit:first-of-type {
          width: 74.5%;
        }
      `}</style>
    </>
  )
}

export default memo(AdminPage)
