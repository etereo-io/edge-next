import React, { memo, useMemo, Fragment, useRef } from 'react'

import {
  ContentTypeDefinition,
  GroupEntityType,
  SuperSearchResponse,
  UserType,
} from '@lib/types'
import { useOnScreen } from '@lib/client/hooks'
import ArrowDown from 'public/icons/arrow-down.svg'

import UserItem from './user-item'
import ContentItems from './content-items'
import GroupItem from './group-item'

interface Props {
  data: SuperSearchResponse[]
}

function List({ data }: Props) {
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

  console.log(isOnScreen)

  return (
    <div className="list-container">
      <div className="list">
        {isEmptyContent && isEmptyGroups && !users.length && (
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
                    <GroupItem key={group.slug} group={group} />
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
          position: fixed;
        }

        .center {
          text-align: center;
        }

        .list {
          width: 455px;
          max-height: 500px;
          overflow-y: auto;
          z-index: 99;
          background: var(--edge-background);
          border-left: var(--light-border);
          border-bottom: var(--light-border);
          padding: 10px;
        }

        .header-title {
          font-size: 2rem;
          margin-bottom: 5px;
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
