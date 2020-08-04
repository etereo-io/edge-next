import Button from '@components/generic/button/button'
import GroupActions from '../../group-actions/group-actions'
import GroupContentMenu from '../../group-content-menu/group-content-menu'
import GroupSummaryView from '../group-summary-view/group-summary-view'
import config from '@lib/config'
import { format } from 'timeago.js'
import { usePermission } from '@lib/client/hooks'
import { useState } from 'react'
import { useUser } from '@lib/client/hooks'

export default function (props) {

  const { user } = useUser()
  
  return (
    <>
      <article className="edge-item-card">

        <div className="edge-item-card-header">
          {props.group.draft && <div className="status">Draft</div>}
        </div>
        <div className="edge-item-card-content">
          <GroupSummaryView
            group={props.group}
            linkToDetail={false}
            type={props.type}
          />
        </div>

        <footer className="edge-item-card-footer">
          <ul className="edge-item-card-stats">
            <li className="edge-item-card-stats-item">
              <b>{format(props.group.createdAt)}</b>
            </li>

          </ul> 
        </footer>
        {props.showActions && (
          <GroupActions
            group={props.group}
          />
        )}

        <GroupContentMenu group={props.group} />
      </article>
      <style jsx>{`
        .edge-item-card-footer {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .edge-item-card-stats {
          display: flex;
        }

        .edge-item-card-stats-item {
          font-size: 13px;
          list-style: none;
          margin-right: var(--edge-gap);
        }

        .edge-item-card {
          background-color: var(--edge-background);
          border-radius: var(--edge-gap-half);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--edge-gap);
          padding: var(--edge-gap-medium);
          position: relative;
        }
        
        @media all and (max-width: 720px) {
          .edge-item-card-footer {
            display: flex;
            flex-flow: column;
          }

          .edge-item-card {
            padding: var(--edge-gap);
          }

          .edge-item-card-stats {
            margin-bottom: var(--edge-gap);
          }

          .edge-item-card-stats-item {
            display: flex;
            flex-flow: column;
            font-size: 12px;
          }

          .edge-item-card-stats-item:last-of-type {
            margin-right: 0;
          }
        }

        .edge-item-card-stats-item b {
          margin-right: var(--edge-gap-half);
        }

        .edge-item-card-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        @media all and (max-width: 460px) {
          .edge-item-card {
            padding: var(--edge-gap);
          }
        }

        .edge-item-card-content {
          margin: var(--edge-gap-double) 0 0;
        }

        .content-summary-content {
          padding-right: var(--edge-gap-double);
        }

        @media all and (max-width: 720px) {
          .content-summary-content {
            padding-right: 0;
          }
        }

        .status {
          background: var(--accents-2);
          border-radius: 4px;
          color: var(--edge-foreground);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

      `}</style>
    </>
  )
}
