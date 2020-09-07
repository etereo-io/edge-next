import React, { memo } from 'react'
import { format } from 'timeago.js'

import { GroupEntityType } from '@lib/types/entities/group'
import { GroupTypeDefinition } from '@lib/types/groupTypeDefinition'
import { GroupTabs } from '@components/groups/read/group-tabs'

import GroupActions from '../../group-actions/group-actions'
import GroupContentMenu from '../../group-content-menu/group-content-menu'
import GroupSummaryView from '../group-summary-view/group-summary-view'

interface Props {
  showActions: boolean
  group: GroupEntityType
  type: GroupTypeDefinition
}

function DetailView({ group, type, showActions }: Props) {
  return (
    <>
      <article className="edge-item-card">
        <div className="edge-item-card-header">
          {showActions && <GroupActions group={group} />}
          {group.draft && <div className="status">Draft</div>}
        </div>
        <div className="edge-item-card-content">
          <GroupSummaryView group={group} linkToDetail={false} type={type} />
        </div>
        <footer className="edge-item-card-footer">
          <ul className="edge-item-card-stats">
            <li className="edge-item-card-stats-item">
              <b>{format(group.createdAt)}</b>
            </li>
          </ul>
        </footer>
        <GroupContentMenu group={group} />
        <GroupTabs id={group.id} group={group} />
      </article>
      <style jsx>{`
        .edge-item-card-footer {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        @media all and (max-width: 720px) {
          .edge-item-card-footer {
            align-items: flex-start;
          }
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

export default memo(DetailView)
