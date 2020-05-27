import Button from '@components/generic/button/button'
import DropdownMenu from '../../generic/dropdown-menu/dropdown-menu'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import { useUser, useContentTypes } from '@lib/client/hooks'
import { useState } from 'react'
import Progress from './progress'
import Avatar from '@components/user/avatar/avatar'

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

          <Link href={`/create/post`}>
            <a className="user-actions-button">
              <Button success>Write a post</Button>
            </a>
          </Link>

          <ul className="navigation">
            <li>
              <DropdownMenu align="right" width={'155px'}>
                <ul>
                  <li>
                    <ThemeSelector />
                  </li>
                  <li>
                    <Link href={`/profile/@${user.username}`}>
                      <a>Profile</a>
                    </Link>
                  </li>
                </ul>
                <span className="spacer"></span>
                <h4>Content</h4>
                <ul>
                  {contentTypes.map((type) => {
                    return (
                      <li key={type.slug}>
                        <Link href={`/create/${type.slug}`}>
                          <a>Create {type.title}</a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <span className="spacer"></span>
                <ul>
                  <li>
                    <a onClick={onClickLogout}>{loading ? '...' : 'Logout'}</a>
                  </li>
                </ul>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      )}
      {!user && (
        <ul className="navigation">
          <li>
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
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
        }

        .navigation li {
          list-style: none;
          margin-left: var(--edge-gap);
        }

        .navigation .dropdown-menu-nav ul li {
          margin-left: 0;
        }

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

        /*User Actions */
        .edge-user-actions {
          align-items: center;
          display: flex;
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

        .edge-avatar {
          margin-right: var(--edge-gap);
        }

        .edge-user-actions-buttons img:last-of-type {
          margin-right: 0;
        }

        .edge-header .edge-button {
          margin-left: var(--edge-gap);
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
      </header>
      <Progress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} />
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

        /*User Actions */
        .edge-user-actions {
          align-items: center;
          display: flex;
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
          width: $edge-gap-triple;
        }

        .edge-user-actions-buttons img:last-of-type {
          margin-right: 0;
        }

        .edge-header .edge-button {
          margin-left: $edge-gap-triple;
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
    </>
  )
}

export default Header
