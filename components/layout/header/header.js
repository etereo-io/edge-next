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
        <img src="/refactor/icon-search.svg" />
        <input type="text" placeholder="Search" />
      </div>

      {user && (
        <div className="edge-user-actions-logged">
          {/*User Actions Buttons*/}
          <div className="edge-user-actions-buttons">
            <img src="/refactor/icon-configuration.svg" />
            <img src="/refactor/icon-messages.svg" />
          </div>
          <Link href={`/profile/@${user.username}`}>
            <a title="User profile">
              {/*Avatar*/}
              <div className="edge-avatar has-status available">
                <img
                  className="edge-avatar-image"
                  src={
                    user && user.profile && user.profile.picture
                      ? user.profile.picture.path
                      : null
                  }
                />
              </div>
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
          list-style: none;
          margin-left: var(--edge-gap);
          padding-left: 0;
          align-items: center;
        }

        .user-admin-button {
          align-items: center;
          background: var(--edge-background);
          border-radius: 50%;
          bottom: var(--edge-gap-double);
          box-shadow: var(--shadow-medium);
          display: flex;
          height: 36px;
          justify-content: center;
          position: fixed;
          right: var(--edge-gap-double);
          width: 36px;
        }

        .user-admin-button svg {
          width: 18px;
        }

        li {
          margin-right: var(--edge-gap);
        }

        li:last-of-type {
          margin-right: 0;
        }

        @media (max-width: 600px) {
          li {
            font-size: 13px;
          }
        }

        li:first-child {
          margin-left: auto;
        }
        a {
          color: var(--edge-link-color);
          display: block;
          font-size: 14px;
          text-decoration: none;
        }
        .user-actions {
          align-items: center;
          display: flex;
        }
        .user-actions-button {
          margin-left: var(--edge-gap);
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
        .header {
          color: var(--edge-foreground);
          background: var(--edge-background);
          display: flex;
          border-bottom: 1px solid var(--accents-2);
          height: 80px;
          position: sticky;
          top: 0;
          z-index: var(--z-index-header);
        }

        @media all and (max-width: 720px) {
          .header {
            height: 56px;
          }
        }

        .header .container {
          align-items: center;
          display: flex;
        }

        .header-content {
          display: flex;
          flex-wrap: wrap;
          margin: 0 auto;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        @media (max-width: 600px) {
          .header-content {
            padding: 0 var(--edge-gap);
          }
        }

        .logo {
          width: 32px;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default Header
