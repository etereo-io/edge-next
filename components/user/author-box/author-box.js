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
      <div className="author-box">
        <div className="avatar">
          {user && (
            <Link href={`/profile/@${user.username}`}>
              <a title={`${user.username} profile`}>
                <Avatar
                  src={user.profile ? user.profile.picture : null}
                  title={`${user.username} avatar`}
                  width={32}
                  height={32}
                />
              </a>
            </Link>
          )}
          {!user && (
            <LoadingPlaceholder
              borderRadius="100%"
              height={'32px'}
              width={'32px'}
            />
          )}
        </div>
        <div className="author-box-user">
          {user && (
            <div className="display-name">
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>
                  {user.profile && user.profile.displayName
                    ? user.profile.displayName
                    : user.username}
                </a>
              </Link>
            </div>
          )}
          {!user && (
            <div className="display-name">
              <LoadingPlaceholder width={'100px'} height={'10px'} />{' '}
            </div>
          )}
          {user && (
            <div className="username">
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>@{user.username}</a>
              </Link>
            </div>
          )}
          {!user && (
            <div className="username">
              <LoadingPlaceholder width={'100px'} />
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {
        `
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
            color: var(--empz-foreground);
            text-decoration: none;
          }
        `}
      </style>
    </>
  )
}
