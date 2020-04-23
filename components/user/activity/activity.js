import Avatar from '../avatar/avatar'

import fetch from '../../../lib/fetcher'
import API from '../../../lib/api/api-endpoints'
import useSWR from 'swr'


export default function(props) {
  const { data, error } = useSWR(props.user ? API.activity + '/' + props.user.id : null, fetch)

  console.log(data)

  return (
    <>
    <div className="activity-stream">
      {!data && (<>
        <div className="activity-item">
          <div className="avatar"><Avatar width={60} loading={true}/></div>
          <div className="loading-message"></div>
        </div>
        <div className="activity-item">
          <div className="avatar"><Avatar width={60} loading={true}/></div>
          <div className="loading-message"></div>
        </div>
        <div className="activity-item">
          <div className="avatar"><Avatar width={60} loading={true}/></div>
          <div className="loading-message"></div>
        </div>
        <div className="activity-item">
          <div className="avatar"><Avatar width={60} loading={true}/></div>
          <div className="loading-message"></div>
        </div>
      </>)}
      {error && <div className="error">Error while loading activity</div>}
      {data && data.results.map(ac => {
        return (
          <div className="activity-item">
            <div className="avatar"><Avatar width={60} src={props.user ? props.user.profile.img : null}/></div>
            <div className="message">{ac.type} {JSON.stringify(ac.meta)}</div>
          </div>
        )
      })}
    </div>
    <style jsx>{
      `
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
        word-break: break-all;
      }

      .loading-message {
        height: 10px;
        background: var(--light-border-color);
        width: 60%;
      }

      .error {
        padding: var(--empz-gap);
      }
      `
    }</style>
  </>)
}