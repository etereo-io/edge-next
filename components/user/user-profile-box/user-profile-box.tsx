import {memo} from 'react'
import Link from 'next/link'

import Avatar from '../avatar/avatar'
import LoadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'

function UserProfileBox({ user, ...props }) {
  return (
    <>
      <div
        className={`general-profile ${props.horizontal ? 'horizontal' : ''} ${
          props.basic ? 'basic' : ''
        } ${props.small ? 'small' : ''}`}
      >
        <div className="profile-avatar-bio">
          <div className="avatar">
            {user && (
              <Link href={`/profile/@${user.username}`}>
                <a title={`${user.username} profile`}>
                  <Avatar
                    user={user}
                  />
                </a>
              </Link>
            )}
            {!user && (
              <LoadingPlaceholder
                borderRadius="15%"
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
        </div>
      </div>
      <style jsx>
        {`
          .general-profile {
            text-align: center;
            position: relative;
          }

          .general-profile.horizontal {
            align-items: center;
            display: flex;
          }

          .general-profile.basic .profile-bio-social {
            display: none;
          }

          .general-profile.horizontal .general-profile-user {
            text-align: left;
            padding-left: var(--edge-gap);
          }

          .general-profile.horizontal .general-profile-user .username,
          .general-profile.horizontal .general-profile-user .display-name {
            justify-content: flex-start;
          }

          .general-profile.horizontal .general-profile-user .display-name {
            font-size: 28px;
          }

          @media all and (max-width: 720px) {
            .general-profile.horizontal .general-profile-user .display-name {
              font-size: 21px;
            }
          }

          .general-profile.horizontal .general-profile-user .username a {
            color: var(--accents-3);
            font-size: 16px;
          }

          @media all and (max-width: 720px) {
            .general-profile.horizontal .general-profile-user .username a {
              font-size: 14px;
            }
          }

          .general-profile.horizontal .profile-avatar-bio {
            align-items: flex-start;
            display: flex;
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
            font-size: 14px;
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
            font-size: 12px;
          }

          .general-profile-bio p {
            text-align: center;
            font-size: 12px;
            line-height: 1.5;
            margin-top: var(--edge-gap);
          }

          .general-profile-social {
            margin-top: var(--edge-gap-half);
          }

          .general-profile-social a img {
            display: inline-block;
            margin-right: var(--edge-gap-half);
            width: 24px;
          }

          .general-profile-bio {
            margin-top: var(--edge-gap);
          }
        `}
      </style>
    </>
  )
}

export default memo(UserProfileBox)
