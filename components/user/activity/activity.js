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
                    width={60}
                    src={props.user ? props.user.profile.picture : null}
                  />
                </div>
                <div className="message">
                  {props.user.profile.displayName || props.user.username}{' '}
                  {getMessage(ac)} {format(ac.createdAt)}
                </div>
              </div>
            )
          })}
      </div>
      <style jsx>{`
        .avatar {
          margin-right: var(--empz-gap);
        }

        .activity-item {
          display: flex;
          border-bottom: var(--light-border);
          align-items: center;
          color: var(--empz-secondary);
        }

        .message {
          width: 60%;
          word-break: break-word;
        }

        .error {
          padding: var(--empz-gap);
        }
      `}</style>
    </>
  )
}
