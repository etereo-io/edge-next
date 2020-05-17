import Avatar from '../avatar/avatar'
import Link from 'next/link'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'

export default function({ user }) {
  return (
    <>
      <div className="author-box">
        <div className="avatar">
          { user && <Link href={`/profile/@${user.username}`}>
          <a title={`${user.username} profile`}>
            <Avatar
              src={user.profile ? user.profile.picture: null}
              title={`${user.username} avatar`}
              width={40}
              height={40}
            />
          </a>
        </Link>}
          { !user && <LoadingPlaceholder borderRadius='100%'  height={'100px'} width={'100px'} />}
        </div>
        <div className="author-box-user">
          <div className="display-name">{ user && user.profile && user.profile ? user.profile.displayName : <LoadingPlaceholder width={'100px'} /> }</div>
          { user && <div className="username">
            <Link href={`/profile/@${user.username}`}>
              <a title={`${user.username} profile`}>
                @{user.username}
              </a>
              </Link>
            </div> }
          {!user && <div className="username"><LoadingPlaceholder width={'100px'} /></div>}
        </div>

      </div>
      <style jsx>{
        `
        .author-box {
          text-align: center;
        }

        .avatar {
          display: flex;
          justify-content: center;
        }

        .author-box-user {
          text-align: center;
        }

        .author-box-user .display-name {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          justify-content: center;
        }

        .author-box-user .username {
          font-size: 14px;
          display: flex;
          justify-content: center;
        }

        `
      } </style>
    </>
  )
}