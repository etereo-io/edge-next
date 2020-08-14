import React, { memo } from 'react'
import { format } from 'timeago.js'
import useSWR from 'swr'
import Link from 'next/link'

import { ACTIVITY_TYPES } from '@lib/constants'
import API from '@lib/api/api-endpoints'
import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import { UserType } from '@lib/types/user'
import fetch from '@lib/fetcher'

import Avatar from '../avatar/avatar'

interface Props {
  user?: UserType
}

function getMessage({ meta, type }) {
  switch (type as ACTIVITY_TYPES) {
    case ACTIVITY_TYPES.CONTENT_UPDATED:
      return (
        <span>
          updated{' '}
          <Link
            href={`/content/${meta.contentType}/${meta.contentId}?field=id`}
          >
            <a title="updated content">a content</a>
          </Link>
        </span>
      )
    case ACTIVITY_TYPES.CONTENT_ADDED:
      return (
        <span>
          created{' '}
          <Link
            href={`/content/${meta.contentType}/${meta.contentId}?field=id`}
          >
            <a title="new content">a content</a>
          </Link>
        </span>
      )

    case ACTIVITY_TYPES.USER_UPDATED:
      return <span>updated the profile information</span>

    case ACTIVITY_TYPES.USER_LOGGED:
      return <span>logged in</span>

    case ACTIVITY_TYPES.COMMENT_ADDED:
      return (
        <span>
          added{' '}
          <Link
            href={`/content/${meta.contentType}/${meta.contentId}?field=id`}
          >
            <a title="new comment">a comment</a>
          </Link>
        </span>
      )

    case ACTIVITY_TYPES.GROUP_ADDED: {
      const { groupType, groupSlug } = meta

      return (
        <span>
          created{' '}
          <Link href={`/group/${groupType}/${groupSlug}`}>
            <a title="new group">a group</a>
          </Link>
        </span>
      )
    }

    case ACTIVITY_TYPES.GROUP_UPDATED: {
      const { groupType, groupSlug } = meta

      return (
        <span>
          updated{' '}
          <Link href={`/group/${groupType}/${groupSlug}`}>
            <a title="updated group">a group</a>
          </Link>
        </span>
      )
    }

    case ACTIVITY_TYPES.COMMENT_DELETED: {
      const { commentId } = meta

      return <span>comment #{commentId} was deleted</span>
    }

    case ACTIVITY_TYPES.COMMENT_UPDATED: {
      const { commentId } = meta

      return <span>comment #{commentId} was updated</span>
    }

    case ACTIVITY_TYPES.CONTENT_DELETED: {
      const { contentId } = meta

      return <span>content #{contentId} was deleted</span>
    }

    case ACTIVITY_TYPES.USER_DELETED: {
      const { userId, username } = meta

      return (
        <span>
          user {username}({userId}) was deleted
        </span>
      )
    }

    case ACTIVITY_TYPES.GROUP_DELETED: {
      const { groupId } = meta

      return <span>group {groupId} was deleted</span>
    }

    case ACTIVITY_TYPES.EMAIL_SENT: {
      const { userId, username } = meta

      return (
        <span>
          email to {username}({userId}) was sent
        </span>
      )
    }

    case ACTIVITY_TYPES.EMAIL_VERIFIED: {
      const { email } = meta

      return <span>email {email} was verified</span>
    }

    case ACTIVITY_TYPES.GROUP_MEMBER_JOIN_DISAPPROVE: {
      const { groupTitle, groupType, groupSlug } = meta

      return (
        <span>
          Administrator rejected joining to the{' '}
          <Link href={`/group/${groupType}/${groupSlug}`}>{groupTitle}</Link>
        </span>
      )
    }

    case ACTIVITY_TYPES.GROUP_MEMBER_JOIN_REQUEST: {
      const { groupTitle, groupType, groupSlug } = meta

      return (
        <span>
          Request for joining to
          <Link href={`/group/${groupType}/${groupSlug}`}>
            {groupTitle}
          </Link>{' '}
          was sent
        </span>
      )
    }

    case ACTIVITY_TYPES.USER_ADDED:
      return <span>user was created</span>

    case ACTIVITY_TYPES.USER_ADDED_MANUALLY:
      return <span>user was created by admin</span>

    default:
      return <span>{type}</span>
  }
}

const array = Array.from(Array(4))

function Activities({ user }: Props) {
  const { data, error } = useSWR(
    user ? `${API.activity}/${user.id}` : null,
    fetch
  )

  return (
    <>
      <div className="activity-stream">
        {!data && (
          <>
            {array.map((_, index) => (
              <div key={index} className="activity-item">
                <div className="avatar">
                  <Avatar width={'40px'} loading={true} />
                </div>
                <LoadingPlaceholder height={'10px'} width={'60%'} />
              </div>
            ))}
          </>
        )}
        {error && <div className="error">Error while loading activity</div>}
        {data &&
          data.results.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="avatar">
                <Avatar
                  width={'40px'}
                  src={
                    user && user.profile.picture
                      ? user.profile.picture.path
                      : null
                  }
                />
              </div>
              <div className="message">
                <strong>{user.profile.displayName || user.username} </strong>{' '}
                <p>
                  {getMessage(activity)} {format(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
      </div>
      <style jsx>{`
        .avatar {
          margin-right: var(--edge-gap-half);
        }

        .activity-item {
          align-items: center;
          border-bottom: 1px solid var(--accents-2);
          display: flex;
          color: var(--edge-secondary);
          padding: var(--edge-gap) 0;
        }

        .activity-item:first-of-type {
          padding-top: 0;
        }

        .activity-item:last-of-type {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .message {
          font-size: 14px;
        }

        .message strong {
          color: var(--edge-foreground);
          display: inline-block;
        }

        .message p {
          color: var(--accents-5);
          display: inline-block;
        }

        .message p span a {
          color: var(--edge-foreground);
          display: inline-block;
        }

        .error {
          padding: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default memo(Activities)
