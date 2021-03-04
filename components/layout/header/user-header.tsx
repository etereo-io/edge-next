import React, { memo, useState } from 'react'
import { hasPermission, purchasingPermission } from '@lib/permissions'
import { useContentTypes, useGroupTypes } from '@lib/client/hooks'

import Avatar from '@components/user/avatar/avatar'
import Button from '@components/generic/button/button'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'
import LanguageChooser from '@components/generic/language-chooser'
import Link from 'next/link'
import SiteMenu from '@components/generic/site-menu/site-menu'
import { SuperSearch } from '@components/generic/super-search'
import ThemeSelector from '@components/generic/theme-selector/theme-selector'

function UserHeader(props) {
  const user = props.user
  const contentTypes = useContentTypes(['create', 'admin'])
  const groupTypes = useGroupTypes(['create', 'admin'])

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
      <SuperSearch user={user} />

      {user && (
        <div className="edge-user-actions-logged">
          {/*User Actions Buttons*/}
          {
            purchasingPermission(user, 'buy') && (
              <div className="edge-user-actions-buttons">
                <Link href={`/shopping-cart/${user.id}`}>
                  <a title="Shopping cart">
                    <i className="las la-shopping-cart"></i>
                  </a>
                </Link>
              </div>
            )

          }
          <div className="edge-user-actions-buttons">
            <Link href={`/settings/${user.id}`}>
              <a title="Settings">
                <i className="las la-cog"></i>
              </a>
            </Link>
          </div>
          <Link href={`/profile/@${user.username}`}>
            <a title="User profile">
              <Avatar width={'36px'} user={user} />
            </a>
          </Link>

          <ul className="navigation">
            <li>
              <DropdownMenu align="right" width={'180px'}>
                <ul>
                  <li>
                    <ThemeSelector />
                  </li>
                  <li>
                    <LanguageChooser />
                  </li>
                  <li className="mobile-menu-item">
                    <SiteMenu />
                  </li>

                  {contentTypes.map((type) => (
                    <li key={type.slug}>
                      <Link href={`/create/content/${type.slug}`}>
                        <a className="header-navigation-item">
                          Create {type.title}
                        </a>
                      </Link>
                    </li>
                  ))}

                  {groupTypes.map((type) => (
                    <li key={type.slug}>
                      <Link href={`/create/group/${type.slug}`}>
                        <a className="header-navigation-item">
                          Create {type.title}
                        </a>
                      </Link>
                    </li>
                  ))}

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
                  <Link href="/faq">
                    <a>FAQ</a>
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

        .edge-user-actions-buttons img:last-of-type {
          margin-right: 0;
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
          font-size: 12px;
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

        @media all and (max-width: 460px) {
          .user-actions-button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default memo(UserHeader)
