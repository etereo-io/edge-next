import React, { memo, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { FIELDS } from '@lib/constants'
import fetch from '@lib/fetcher'
import { useUser } from '@lib/client/hooks'
import { groupUserPermission } from '@lib/permissions'
import API from '@lib/api/api-endpoints'
import { GroupEntityType, GroupTypeDefinition } from '@lib/types'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import GroupMembers from '@components/groups/group-members/group-members'
import Button from '@components/generic/button/button'

interface Props {
  linkToDetail: boolean
  group: GroupEntityType
  className: string
  type: GroupTypeDefinition
}

function SummaryView({ linkToDetail, group, className, type }: Props) {
  const [clicked, setClicked] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inMembersList, setInMembersList] = useState<boolean>(false)
  const [inPendingMembersList, setInPendingMembersList] = useState<boolean>(
    false
  )
  const shouldAddLink = useCallback(
    (field) => {
      return (
        linkToDetail &&
        ![FIELDS.IMAGE, FIELDS.FILE, FIELDS.TAGS, FIELDS.VIDEO_URL].includes(
          field.type
        )
      )
    },
    [linkToDetail]
  )

  const currentUser = useUser()
  const canJoin = groupUserPermission(
    currentUser?.user,
    type.slug,
    'join',
    group
  )

  useEffect(() => {
    if (currentUser.user) {
      const {
        user: { id: currentUserId },
      } = currentUser

      setInMembersList(
        (group.members || []).some(({ id }) => currentUserId === id)
      )
      setInPendingMembersList(
        (group.pendingMembers || []).some(({ id }) => currentUserId === id)
      )
    }
  }, [currentUser, group])

  const handleJoinRequest = useCallback(() => {
    setIsLoading(true)
    fetch(`${API.groups[group.type]}/${group.slug}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentUser.user),
    })
      .then(() => {
        setClicked(true)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [currentUser, group.type, group.slug])

  return (
    <>
      <div className={`group-summary-view ${className}`}>
        <div className="">
          <div className="group-top-section">
            {type.fields
              .filter((f) => f.name === type.publishing.title)
              .map((field) => {
                return (
                  <h1
                    className="content-title"
                    key={`${field.name}-${group.id}`}
                  >
                    {linkToDetail && (
                      <Link href={`/group/${type.slug}/${group.slug}`}>
                        <a>{group[field.name]}</a>
                      </Link>
                    )}
                    {!linkToDetail && group[field.name]}
                  </h1>
                )
              })}

            {group.members && (
              <GroupMembers members={group.members} visible={3} />
            )}
          </div>

          {type.fields
            .filter((f) => !f.hidden)
            .filter((f) => f.name !== type.publishing.title)
            .map((field) => {
              return (
                <div key={`${field.name}-${group.id}`}>
                  {shouldAddLink(field) && (
                    <Link href={`/group/${type.slug}/${group.slug}`}>
                      <a title="Go to item detail">
                        <DynamicFieldView
                          field={field}
                          value={group[field.name]}
                          typeDefinition={type}
                        />
                      </a>
                    </Link>
                  )}
                  {!shouldAddLink(field) && (
                    <DynamicFieldView
                      field={field}
                      value={group[field.name]}
                      typeDefinition={type}
                    />
                  )}
                </div>
              )
            })}
          <div className="join-to-group-section">
            {(inPendingMembersList || clicked) && (
              <Button warning restProps={{ disabled: true }}>
                Request to join is in Pending status
              </Button>
            )}
            {canJoin && !inPendingMembersList && !inMembersList && !clicked && (
              <Button success loading={isLoading} onClick={handleJoinRequest}>
                Join
              </Button>
            )}
            {error && <div>Something went wrong.</div>}
          </div>
        </div>
      </div>
      <style jsx>{`
        .group-top-section {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: var(--edge-gap);
          justify-content: space-between;
          align-items: center;
        }

        .content-title {
          font-size: 24px;
          line-height: 1;
          padding-right: var(--edge-gap);
        }

        @media all and (max-width: 720px) {
          .content-title {
            font-size: 21px;
            line-height: 1.25;
            padding-right: 0;
          }
        }

        a {
          text-decoration: none;
          color: var(--edge-link-color);
        }

        .join-to-group-section {
          text-align: right;
        }
      `}</style>
    </>
  )
}

export default memo(SummaryView)
