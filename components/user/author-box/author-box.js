import Avatar from '../avatar/avatar'
import Link from 'next/link'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'
import { useEffect, useState } from 'react'

export default function (props) {
  const [user, setUser] = useState(props.user)

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

  return (
    <>
      <div className="edge-avatar-user">
        <div>
          {user && (
            <Link href={`/profile/@${user.username}`}>
              <a title={`${user.username} profile`}>
                <Avatar
                  width={'32px'}
                  status="available"
                  src={
                    user.profile && user.profile.picture
                      ? user.profile.picture.path
                      : null
                  }
                />
              </a>
            </Link>
          )}
          {!user && (
            <LoadingPlaceholder
              borderRadius="15%"
              height={'32px'}
              width={'32px'}
            />
          )}
        </div>

        <div className="edge-avatar-user-info">
          {user && (
            <strong className="edge-user-name">
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>
                  {user.profile && user.profile.displayName
                    ? user.profile.displayName
                    : user.username}
                </a>
              </Link>
            </strong>
          )}
          {!user && (
            <div className="display-name">
              <LoadingPlaceholder width={'100px'} height={'10px'} />{' '}
            </div>
          )}
          {user && (
            <small className="edge-user-alias">
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>@{user.username}</a>
              </Link>
            </small>
          )}
          {!user && (
            <span className="edge-user-alias">
              <LoadingPlaceholder width={'100px'} />
            </span>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .author-box {
            align-items: center;
            display: flex;
          }

          .avatar {
            display: flex;
            justify-content: center;
            margin-right: 4px;
          }

          .author-box-user .display-name {
            font-size: 14px;
            font-weight: 600;
            text-transform: lowercase;
            line-height: 1;
          }

          .author-box-user .display-name::first-letter {
            text-transform: uppercase;
          }

          .username {
            line-height: 1;
            font-size: 12px;
          }

          .author-box-user a {
            color: var(--edge-foreground);
            text-decoration: none;
          }
        `}
      </style>
    </>
  )
}
