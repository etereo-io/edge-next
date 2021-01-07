import { useContentTypes, useGroupTypes } from '@lib/client/hooks'

import Link from 'next/link'
import React from 'react'
import { UserType } from '@lib/types'
import { hasPermission } from '@lib/permissions'

type PropTypes = {
  user: UserType
}

export default function AdminSubHeader({ user }: PropTypes) {
  // Links
  const contentTypes = useContentTypes(['admin'])
  const groupTypes = useGroupTypes(['admin'])

  const groupLinks = groupTypes.map(({ slug, title }) => ({
    link: `/admin/groups/${slug}`,
    title: `${title}`,
  }))

  const contentLinks = contentTypes.map((type) => {
    return {
      link: `/admin/content/${type.slug}`,
      title: `${type.title}`,
    }
  })

  return (
    <>
      <div className="admin-sub-header">
        <div className="edge-container">
          <ul className="admin-navigation">
            {hasPermission(user, `admin.stats`) && <li>
              <Link href="/admin">
                <a title="Admin">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs />
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path
                      className="icon"
                      d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                    />
                  </svg>
                  <span>Administration</span>
                </a>
              </Link>
            </li>}


            {hasPermission(user, `user.admin`) && <li>
              <Link href="/admin/users">
                <a title="Admin">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs />
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      className="icon"
                      fill-rule="evenodd"
                      d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87z"
                    />
                    <circle
                      className="icon"
                      cx="9"
                      cy="8"
                      r="4"
                      fill-rule="evenodd"
                    />
                    <path
                      className="icon"
                      fill-rule="evenodd"
                      d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24C14.5 5.27 15 6.58 15 8s-.5 2.73-1.33 3.76c.42.14.86.24 1.33.24zM9 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  <span>Users</span>
                </a>
              </Link>
            </li>}


            {hasPermission(user, `admin.email`) && <li>
              <Link href="/admin/emails">
                <a title="Admin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <defs />
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      className="icon"
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                  <span>Emails</span>
                </a>
              </Link>
            </li>}

            <li className="view-more">
              <a title="Content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <defs />
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    className="icon"
                    d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  />
                </svg>
                <span>Content</span>
              </a>
              <ul>
                {contentLinks.map(link => {
                  return (
                    <li>
                      <Link href={link.link}>
                        <a title={`Administer ${link.title}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <defs />
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              className="icon"
                              d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                            />
                          </svg>
                          <span>{link.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="view-more">
              <a title="Groups">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <defs />
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    className="icon"
                    d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  />
                </svg>
                <span>Groups</span>
              </a>
              <ul>
                {groupLinks.map(link => {
                  return (
                    <li>
                      <Link href={link.link}>
                        <a title={`Administer ${link.title}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <defs />
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              className="icon"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            />
                          </svg>
                          <span>{link.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>


          </ul>
        </div>
      </div >
      <style jsx>{`
        .admin-sub-header {
          background: var(--accents-8);
          color: var(--edge-background);
          padding: 0;
        }
        .admin-sub-header::-webkit-scrollbar {
          display: none;
        }
        .admin-navigation {
          display: flex;
        }
        .admin-navigation li {
          list-style: none;
          transition: 0.35s ease;
        }
        .admin-navigation li a {
          font-size: 12px;
          font-weight: 500;
          align-items: center;
          display: flex;
          padding: 6px 8px;
        }
        .admin-navigation li a span {
          line-height: 1;
        }
        .admin-navigation li:hover {
          background: var(--accents-6);
        }
        .admin-navigation li:hover .icon {
          fill: var(--accents-2);
        }
        svg {
          margin-right: 4px;
          width: 20px;
        }
        .icon {
          fill: var(--accents-4);
          transition: 0.35s ease;
        }
        .view-more{
          padding-right: 32px;
          position: relative;
          user-select: none;
        }
        .view-more ul{
          background: var(--accents-8);
          display: flex;
          flex-flow: column;
          max-height: 0;
          overflow: hidden;
          position: absolute;
          top: 0;
          transform: translateY(32px);
          transition: 0.35s ease;
          width: 100%;
          z-index: 2;
        }
        .view-more:hover ul{
          max-height: 160px;
        }

        @media all and (max-width: 640px){
          .admin-navigation li a span {
            max-width: 0;
            overflow: hidden;
            transition: 0.35s ease;
          }

          .admin-navigation li:hover a span {
            max-width: 100px;
          }

          .view-more {
            padding-right: 80px;
          }

          svg{
            box-sizing: content-box;
            margin: 0;
            padding: 0 4px;
          }

          .admin-navigation .view-more ul li a span {
            display: block;
          }

          .admin-navigation .view-more:hover li{
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
