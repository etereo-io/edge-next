import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { GroupEntityType, GroupTypeDefinition } from '@lib/types'
import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import DynamicFieldView from '@components/generic/dynamic-field/dynamic-field-view'
import { FIELDS } from '@lib/constants'
import GroupMembers from '@components/groups/group-members/group-members'
import Link from 'next/link'
import fetch from '@lib/fetcher'
import { cypheredFieldPermission, groupUserPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'
import { Interaction } from '@components/generic/interactions'
import { getInteractionsDefinition } from '@lib/config'

interface Props {
  linkToDetail?: boolean
  group: GroupEntityType
  className?: string
  type: GroupTypeDefinition
}

function SummaryView({
  linkToDetail = false,
  className = '',
  group,
  type,
}: Props) {
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

  const permittedFields = useMemo(
    () =>
      type.fields.filter((field) => {
        if (!field.cypher || !field.cypher.enabled) {
          return true
        }

        return (
          cypheredFieldPermission(
            currentUser?.user,
            'group',
            type.slug,
            field.name
          ) || currentUser?.user?.id === group?.author
        )
      }),
    [currentUser, type]
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

  const interactionsConfig = getInteractionsDefinition('group', type.slug)
  const isGroupCreation = useMemo(() => !group?.id, [group?.id])

  return (
    <>
      <div className={`group-summary-view ${className}`}>
        <div className="">
          <div className="group-top-section">
            {permittedFields
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

          {permittedFields
            .filter((f) => !f.hidden)
            .filter((f) => f.name !== type.publishing.title)
            .map((field) => {
              return (
                <div className="description" key={`${field.name}-${group.id}`}>
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
          {!isGroupCreation && (
            <div className="join-to-group-section">
              {(inPendingMembersList || clicked) && (
                <Button warning restProps={{ disabled: true }}>
                  Pending
                </Button>
              )}
              {canJoin && !inPendingMembersList && !inMembersList && !clicked && (
                <Button success loading={isLoading} onClick={handleJoinRequest}>
                  Join
                </Button>
              )}
              {error && (
                <div className="error-message">Something went wrong.</div>
              )}
            </div>
          )}
          {!isGroupCreation &&
            interactionsConfig.map((interaction) => (
              <Interaction
                key={interaction.type}
                interactions={group.interactions}
                interactionConfig={interaction}
                entity="group"
                entityType={type.slug}
                entityId={group.id}
              />
            ))}
        </div>
      </div>
      <style jsx>{`
        .description {
          color: var(--accents-4);
          font-size: 12px;
          margin-bottom: 16px;
          padding-right: 110px;
        }

        @media all and (max-width: 720px) {
          .description {
            padding-right: 0;
          }
        }

        .group-top-section {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: var(--edge-gap);
          justify-content: space-between;
          align-items: center;
        }

        .content-title {
          font-size: 23px;
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
