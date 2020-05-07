import Avatar from '../avatar/avatar'

import fetch from '../../../lib/fetcher'
import API from '../../../lib/api/api-endpoints'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'
import useSWR from 'swr'

export default function (props) {
  const { data, error } = useSWR(
    props.user ? API.activity + '/' + props.user.id : null,
    fetch
  )

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
                  {ac.type} {new Date(ac.createdAt).toDateString()}
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
