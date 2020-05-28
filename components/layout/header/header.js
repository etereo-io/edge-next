import Button from '@components/generic/button/button'
import DropdownMenu from '../../generic/dropdown-menu/dropdown-menu'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import { useUser, useContentTypes } from '@lib/client/hooks'
import { useState } from 'react'
import Progress from './progress'
import Avatar from '@components/user/avatar/avatar'
import { hasPermission } from '@lib/permissions'

function UserHeader(props) {
  const user = props.user
  const contentTypes = useContentTypes(['create', 'admin'])
  const [loading, setLoading] = useState(false)

  const onClickLogout = async () => {
    setLoading(true)

    // Invalidate caches for service worker
    await caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          return caches.delete(key)
        })
      )
    })

    window.location.href = '/api/auth/logout'
  }

  return (
    <div className="edge-user-actions">
      {/*Searchbox*/}
      <div className="edge-searchbox">
        <img src="/icons/icon-search.svg" />
        <input type="text" placeholder="Search" />
      </div>

      {user && (
        <div className="edge-user-actions-logged">
          {/*User Actions Buttons*/}
          <div className="edge-user-actions-buttons">
            <img src="/icons/icon-configuration.svg" />
            <img src="/icons/icon-messages.svg" />
          </div>
          <Link href={`/profile/@${user.username}`}>
            <a title="User profile">
              <Avatar
                width={'36px'}
                src={
                  user && user.profile && user.profile.picture
                    ? user.profile.picture.path
                    : null
                }
              />
            </a>
          </Link>

          <div className="user-actions-button">
            <Link href={`/create/post`}>
              <a>
                <Button success>Write a post</Button>
              </a>
            </Link>
          </div>

          <ul className="navigation">
            <li>
              <DropdownMenu align="right" width={'180px'}>
                <ul>
                  <li>
                    <ThemeSelector />
                  </li>
                  <li className="mobile-menu-item">
                    <a href="#" className="header-navigation-item">
                      <img
                        className="edge-header-navigation-icon"
                        src="/icons/icon-groups.svg"
                      />
                      <span className="edge-header-navigation-title">
                        My Groups
                      </span>
                    </a>
                  </li>
                  <li className="mobile-menu-item">
                    <a href="#" className="header-navigation-item">
                      <img
                        className="edge-header-navigation-icon"
                        src="/icons/icon-rewards.svg"
                      />
                      <span className="edge-header-navigation-title">
                        Rewards
                      </span>
                    </a>
                  </li>
                  <li className="mobile-menu-item">
                    <a href="#" className="header-navigation-item">
                      <img
                        className="edge-header-navigation-icon"
                        src="/icons/icon-courses.svg"
                      />
                      <span className="edge-header-navigation-title">
                        Courses
                      </span>
                    </a>
                  </li>
                  <li className="mobile-menu-item">
                    <a href="#" className="header-navigation-item">
                      <img
                        className="edge-header-navigation-icon"
                        src="/icons/icon-analytics.svg"
                      />
                      <span className="edge-header-navigation-title">
                        Analytics
                      </span>
                    </a>
                  </li>

                  {contentTypes.map((type) => {
                    return (
                      <li key={type.slug}>
                        <Link href={`/create/${type.slug}`}>
                          <a className="header-navigation-item">
                            Create {type.title}
                          </a>
                        </Link>
                      </li>
                    )
                  })}

                  {hasPermission(user, 'admin.access') && (
                    <li>
                      <Link href="/admin">
                        <a className="header-navigation-item">Administration</a>
                      </Link>
                    </li>
                  )}
                </ul>
                <ul>
                  <li>
                    <Button fullWidth>
                      <a onClick={onClickLogout}>
                        {loading ? '...' : 'Logout'}
                      </a>
                    </Button>
                  </li>
                </ul>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      )}
      {!user && (
        <ul className="navigation not-logged">
          <li>
            <Button href="/auth/login">Login</Button>
          </li>
          <li>
            <Button href="/auth/signup">Sign up</Button>
          </li>

          <li>
            <DropdownMenu align="right">
              <ul>
                <li>
                  <ThemeSelector />
                </li>
                <li>
                  <Link href="/components">
                    <a>Components</a>
                  </Link>
                </li>
              </ul>
            </DropdownMenu>
          </li>
        </ul>
      )}
      <style jsx>{`
        .navigation {
          display: flex;
          align-items: center;
          margin-left: var(--edge-gap-half);
        }

        .navigation li {
          list-style: none;
          margin-left: 0;
        }

        .navigation.not-logged li {
          margin: 0 4px;
        }

        .navigation.not-logged li:last-of-type {
          margin-left: var(--edge-gap);
        }

        .navigation .dropdown-menu-nav ul li {
          margin-left: 0;
        }

        /* Mobile Items */
        .navigation li.mobile-menu-item {
          display: none;
        }

        @media all and (max-width: 460px) {
          .navigation li.mobile-menu-item {
            display: block;
          }
        }

        /*User Actions */
        .edge-user-actions {
          align-items: center;
          display: flex;
        }

        .user-actions-button {
          margin-left: var(--edge-gap);
        }

        /*User Actions Logged */
        .edge-user-actions-logged {
          align-items: center;
          display: flex;
        }

        /*User Actions Buttons */
        .edge-user-actions-buttons {
          margin: 0 var(--edge-gap);
        }

        .edge-user-actions-buttons img {
          margin-right: var(--edge-gap);
          width: var(--edge-gap);
        }

        .edge-avatar  {
          margin-right: var(--edge-gap);
        }

        .edge-user-actions-buttons img:last-of-type {
          margin-right: 0;
        }

        .edge-header .edge-button {
          margin-left: var(--edge-gap);
        }

        .edge-panel-header-navigation {
          padding: var(--edge-gap) 0;
        }

        .edge-panel-header-navigation ul li {
          list-style: none;
          width: 1005;
        }

        .header-navigation-item {
          align-items: center;
          border-radius: 4px;
          display: flex;
          font-size: 14px;
          font-weight: 500;
          padding: var(--edge-gap-half);
          text-decoration: none;
          transition: background-color 0.35s ease;
          width: 100%;
          will-change: background-color;
        }

        .header-navigation-item:hover {
          background-color: var(--accents-1);
        }

        .edge-header-navigation-icon {
          width: 16px;
        }

        .edge-header-navigation-title {
          margin-left: var(--edge-gap-half);
        }

        @media all and (max-width: 720px) {
          .edge-header {
            height: 56px;
          }
        }

        @media all and (max-width: 640px) {
          .edge-searchbox {
            display: none;
          }
        }

        @media all and (max-width: 460px) {
          .edge-button,
          .user-actions-button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

const Header = () => {
  const { user } = useUser()
  return (
    <>
      <header className="edge-header">
        <div className="edge-container">
          <Link href="/">
            <a title="Home page">
              <EdgeLogo />
            </a>
          </Link>

          <UserHeader user={user} />
        </div>
        <Progress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
        />
      </header>
      <style jsx>{`
        .edge-header {
          align-items: center;
          background: var(--edge-background);
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
          display: flex;
          height: 80px;
          position: sticky;
          top: 0;
          z-index: var(--z-index-header);
        }

        .edge-container {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        @media all and (max-width: 720px) {
          .edge-header {
            height: 56px;
          }
        }

        @media all and (max-width: 640px) {
          .edge-searchbox {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default Header
