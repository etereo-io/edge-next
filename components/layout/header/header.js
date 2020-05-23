import Button from '@components/generic/button/button'
import DropdownMenu from '../../generic/dropdown-menu/dropdown-menu'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import { hasPermission } from '@lib/permissions'
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
    <nav>
      {user && (
        <div className="user-actions">
          <Link href={`/profile/@${user.username}`}>
            <a title="User profile">
              <Avatar
                src={
                  user && user.profile && user.profile.picture
                    ? user.profile.picture.path
                    : null
                }
                width="36"
              />
            </a>
          </Link>

          <Link href={`/create/post`}>
            <a className="user-actions-button">
              <Button success>Write a post</Button>
            </a>
          </Link>

          <ul className="navigation">
            {hasPermission(user, 'admin.access') && (
              <li>
                <Link href="/admin">
                  <a className="user-admin-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <defs />
                      <path
                        fill="var(--edge-foreground)"
                        d="M23.539 14.7955l-2.4276-1.8602a8.8388 8.8388 0 000-1.8706l2.4276-1.8601a.9375.9375 0 00.2371-1.2207l-2.3509-3.9834a.9374.9374 0 00-1.1509-.3957l-2.8802 1.1344a9.1663 9.1663 0 00-1.683-.9535L15.2787.803A.9376.9376 0 0014.3509 0H9.6491a.9374.9374 0 00-.9277.803L8.289 3.7858c-.594.2581-1.157.577-1.683.9535L3.7258 3.6048a.9374.9374 0 00-1.151.3958L.224 7.9839a.9375.9375 0 00.2372 1.2207l2.4276 1.8601a8.8368 8.8368 0 000 1.8706L.461 14.7954a.9375.9375 0 00-.2371 1.2207l2.3508 3.9834a.9375.9375 0 001.151.3957l2.8802-1.1343a9.1591 9.1591 0 001.683.9534l.4323 2.9827c.0669.461.462.803.9278.803h4.7018a.9376.9376 0 00.9278-.803l.4324-2.9826a9.1653 9.1653 0 001.6829-.9535l2.8803 1.1344a.9375.9375 0 001.1509-.3958l2.3509-3.9833a.9376.9376 0 00-.2371-1.2207z"
                      />
                      <path
                        fill="var(--edge-background)"
                        d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.2429-5-5-5zm0 7.5c-1.3785 0-2.5-1.1215-2.5-2.5s1.1215-2.5 2.5-2.5 2.5 1.1215 2.5 2.5-1.1215 2.5-2.5 2.5z"
                      />
                    </svg>
                  </a>
                </Link>
              </li>
            )}

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
          margin-left: 0;
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
        .user-actions-button{
          margin-left: var(--edge-gap);
        }
      `}</style>
    </nav>
  )
}

const Header = () => {
  const { user } = useUser()
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="left-header">
              <Link href="/">
                <a title="Home page">
                  <EdgeLogo />
                </a>
              </Link>
            </div>

            <div className="right-header">
              <UserHeader user={user} />
            </div>
          </div>
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
