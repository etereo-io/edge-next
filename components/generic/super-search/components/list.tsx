import {
  ContentTypeDefinition,
  GroupEntityType,
  SuperSearchResponse,
  UserType,
} from '@lib/types'
import React, { Fragment, memo, useMemo, useRef } from 'react'

import ArrowDown from '@icons/arrow-down.svg'
import ContentItems from './content-items'
import GroupItem from './group-item'
import UserItem from './user-item'
import { useOnScreen } from '@lib/client/hooks'

interface Props {
  data: SuperSearchResponse[]
  isLoading: boolean
}

function List({ data, isLoading }: Props) {
  const users = useMemo(
    () =>
      data
        .filter(({ type }) => type === 'user')
        .map(({ data }) => data)
        .flat(),
    [data]
  )
  const groups = useMemo(() => data.filter(({ type }) => type === 'group'), [
    data,
  ])
  const content = useMemo(() => data.filter(({ type }) => type === 'content'), [
    data,
  ])

  const isEmptyGroups = useMemo(
    () => groups.every(({ data: groupData }) => !groupData.length),
    [groups]
  )
  const isEmptyContent = useMemo(
    () => content.every(({ data: contentData }) => !contentData.length),
    [content]
  )

  const endOfListRef = useRef(null)

  const isOnScreen = useOnScreen(endOfListRef, '0px')

  return (
    <div className="list-container">
      <div className="list">
        {isEmptyContent && isEmptyGroups && !users.length && !isLoading && (
          <div>Nothing found</div>
        )}
        {!!users.length && (
          <>
            <span className="header-title">Users</span>
            {users.map((user: Partial<UserType>) => (
              <UserItem key={user.id} user={user} />
            ))}
          </>
        )}
        {!isEmptyGroups && (
          <>
            <hr />
            <span className="header-title">Groups</span>
            {groups.map(({ data: groupData, name }) => (
              <Fragment key={name}>
                {!!groupData.length &&
                  (groupData as Partial<GroupEntityType>[]).map((group) => (
                    <GroupItem key={group.seo.slug} group={group} />
                  ))}
              </Fragment>
            ))}
          </>
        )}
        {!isEmptyContent && (
          <>
            <hr />
            <span className="header-title">Content</span>
            {content.map(({ data: contentData, name }) => (
              <ContentItems
                key={name}
                items={contentData as Partial<ContentTypeDefinition>[]}
                name={name}
              />
            ))}
          </>
        )}
        <span ref={endOfListRef} />
      </div>
      {!isOnScreen && (
        <div className="center">
          <ArrowDown style={{ height: 20, weight: 20 }} />
        </div>
      )}
      <style jsx>{`
        .list-container {
          position: absolute;
        }
        
        hr{
          border-color: var(--accents-2);
          border-top: 0;
          display: block;
          margin: var(--edge-gap-half) 0;
        }

        .center {
          text-align: center;
        }

        .list {
          width: 100%;
          max-height: 420px;
          overflow-y: auto;
          z-index: 99;
          background: var(--edge-background);
          border-radius: 8px;
          box-shadow: var(--shadow-small);
          padding: 10px;
        }

        .header-title {
          display: block;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .item {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default memo(
  List,
  ({ data: prevData }, { data }) =>
    JSON.stringify(data) === JSON.stringify(prevData)
)
