import Avatar from '../avatar/avatar'
import Link from 'next/link'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'

export default function ({ user, ...props }) {
  return (
    <>
      <div
        className={`general-profile ${props.horizontal ? 'horizontal' : ''}`}
      >
        <div className="profile-avatar-bio">
          <div className="avatar">
            {user && (
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>
                  <Avatar
                    src={
                      user.profile.picture ? user.profile.picture.path : null
                    }
                    title={`${user.username} avatar`}
                  />
                </a>
              </Link>
            )}
            {!user && (
              <LoadingPlaceholder
                borderRadius="100%"
                height={'100px'}
                width={'100px'}
              />
            )}
          </div>
          <div className="general-profile-user">
            <div className="display-name">
              {user && user.profile && user.profile ? (
                user.profile.displayName
              ) : (
                <LoadingPlaceholder width={'100px'} />
              )}
            </div>
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

        <div className="profile-bio-social">
          {user && user.profile.bio && (
            <div className="general-profile-bio">
              <p>{user.profile.bio}</p>
            </div>
          )}

          {user && (
            <div className="general-profile-social">
              {user.profile.github && (
                <a href={user.profile.github}>
                  <img src="/icons/github.svg" alt="Github icon" />
                </a>
              )}

              {user.profile.facebook && (
                <a href={user.profile.facebook}>
                  <img src="/icons/facebook.svg" alt="Facebook icon" />
                </a>
              )}
              {user.profile.twitter && (
                <a href={user.profile.twitter}>
                  <img src="/icons/twitter.svg" alt="Twitter icon" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .general-profile {
            text-align: center;
          }

          .general-profile.horizontal {
            align-items: center;
            display: flex;
          }

          .general-profile.horizontal .general-profile-user {
            text-align: left;
            padding-left: var(--edge-gap-half);
          }

          .general-profile.horizontal .general-profile-user .username,
          .general-profile.horizontal .general-profile-user .display-name {
            justify-content: flex-start;
          }

          .general-profile.horizontal .profile-avatar-bio {
            align-items: center;
            display: flex;
            margin-right: var(--edge-gap-double);
          }

          .general-profile.horizontal .profile-bio-social {
            max-width: 320px;
          }

          .general-profile.horizontal .profile-bio-social,
          .general-profile.horizontal .general-profile-bio p {
            margin-top: 0;
            text-align: left;
          }

          .avatar {
            display: flex;
            justify-content: center;
          }

          .general-profile-user {
            text-align: center;
          }

          .general-profile-user .display-name {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: center;
          }

          .general-profile-user .username {
            display: flex;
            justify-content: center;
          }

          .general-profile-user a {
            color: var(--edge-foreground);
            text-decoration: none;
            font-size: 14px;
          }

          .general-profile-bio p {
            text-align: center;
            font-size: 14px;
            line-height: 1.5;
            margin-top: var(--edge-gap);
            color: var(--accents-5);
          }

          .general-profile-social {
            margin-top: var(--edge-gap-half);
          }

          .general-profile-social a img {
            display: inline-block;
            margin: 0 4pt;
            width: 21px;
          }
        `}
      </style>
    </>
  )
}
