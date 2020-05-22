import Avatar from '../avatar/avatar'

import fetch from '@lib/fetcher'
import API from '@lib/api/api-endpoints'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'
import useSWR from 'swr'
import { format } from 'timeago.js'
import Link from 'next/link'

export default function (props) {
  const { data, error } = useSWR(
    props.user ? API.activity + '/' + props.user.id : null,
    fetch
  )

  const getMessage = (activity) => {
    switch (activity.type) {
      case 'content_updated':
        return (
          <span>
            updated{' '}
            <Link
              href={`/content/${activity.meta.contentType}/${activity.meta.contentId}?field=id`}
            >
              <a title="updated content">a content</a>
            </Link>
          </span>
        )

      case 'content_added':
        return (
          <span>
            created{' '}
            <Link
              href={`/content/${activity.meta.contentType}/${activity.meta.contentId}?field=id`}
            >
              <a title="new content">a content</a>
            </Link>
          </span>
        )

      case 'user_updated':
        return <span>updated the profile information</span>

      case 'user_logged':
        return <span>logged in</span>

      case 'comment_added':
        return (
          <span>
            added{' '}
            <Link
              href={`/content/${activity.meta.contentType}/${activity.meta.contentId}?field=id`}
            >
              <a title="new comment">a comment</a>
            </Link>
          </span>
        )

      default:
        return <span>{activity.type}</span>
    }
  }

  return (
    <>
      <div className="activity-stream">
        {!data && (
          <>
            <div className="activity-item">
              <div className="avatar">
                <Avatar width={60} loading={true} />
              </div>
              <LoadingPlaceholder height={'10px'} width={'60%'} />
            </div>
            <div className="activity-item">
              <div className="avatar">
                <Avatar width={60} loading={true} />
              </div>
              <LoadingPlaceholder height={'10px'} width={'60%'} />
            </div>
            <div className="activity-item">
              <div className="avatar">
                <Avatar width={60} loading={true} />
              </div>
              <LoadingPlaceholder height={'10px'} width={'60%'} />
            </div>
            <div className="activity-item">
              <div className="avatar">
                <Avatar width={60} loading={true} />
              </div>
              <LoadingPlaceholder height={'10px'} width={'60%'} />
            </div>
          </>
        )}
        {error && <div className="error">Error while loading activity</div>}
        {data &&
          data.results.map((ac) => {
            return (
              <div className="activity-item">
                <div className="avatar">
                  <Avatar
                    width={40}
                    src={
                      props.user && props.user.profile.picture
                        ? props.user.profile.picture.path
                        : null
                    }
                  />
                </div>
                <div className="message">
                  <strong>
                    {props.user.profile.displayName || props.user.username}{' '}
                  </strong>{' '}
                  <p>
                    {getMessage(ac)} {format(ac.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
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
