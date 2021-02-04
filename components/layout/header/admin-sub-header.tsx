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
  const groupTypes = useGroupTypes(['admin'])
  const groupLinks = groupTypes.map(({ slug, title }) => ({
    link: `/admin/groups/${slug}`,
    title: `${title}`,
  }))

  const contentTypes = useContentTypes(['admin'])
  const contentLinks = contentTypes.map((type) => {
    return {
      link: `/admin/content/${type.slug}`,
      title: `${type.title}`,
    }
  })

  const createContentTypes = useContentTypes(['create'])
  const createContentTypeLinks = createContentTypes.map((type) => {
    return {
      link: `/create/content/${type.slug}`,
      title: `${type.title}`,
    }
  })
  const createGroupTypes = useGroupTypes(['create'])
  const createGroupTypeLinks = createGroupTypes.map((type) => {
    return {
      link: `/create/group/${type.slug}`,
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
                  <i className="las la-cog"></i>
                  <span>Administration</span>
                </a>
              </Link>
            </li>}


            {hasPermission(user, `user.admin`) && <li>
              <Link href="/admin/users">
                <a title="Admin">
                  <i className="las la-users-cog"></i>
                  <span>Users</span>
                </a>
              </Link>
            </li>}


            {hasPermission(user, `admin.email`) && <li>
              <Link href="/admin/emails">
                <a title="Admin">
                  <i className="las la-envelope"></i>
                  <span>Emails</span>
                </a>
              </Link>
            </li>}

            {hasPermission(user, 'admin.access') && <li className="view-more">
              <a title="Content">
                <i className="las la-file"></i>
                <span>Content</span>
              </a>
              <ul>
                {contentLinks.map(link => {
                  return (
                    <li key={link.link}>
                      <Link href={link.link}>
                        <a title={`Administer ${link.title}`}>
                          <i className="las la-file"></i>
                          <span>{link.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            }
            {hasPermission(user, 'admin.access') && <li className="view-more">
              <a title="Groups">
                <i className="las la-users"></i>
                <span>Groups</span>
              </a>
              <ul>
                {groupLinks.map(link => {
                  return (
                    <li key={link.link}>
                      <Link href={link.link}>
                        <a title={`Administer ${link.title}`}>
                          <i className="las la-users"></i>
                          <span>{link.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>}

            {(hasPermission(user, 'purchasing.orders') || hasPermission(user, 'purchasing.sell')) && <li>
              <Link href="/orders">
                <a title="Orders">
                  <i className="las la-cubes"></i>
                  <span>Orders</span>
                </a>
              </Link>
            </li>}
            <li className="view-more">
              <a title="Create">
                <i className="las la-plus-circle"></i>
                <span>Create</span>
              </a>
              <ul>
                {createContentTypeLinks.map(link => {
                  return (
                    <li key={link.link}>
                      <Link href={link.link}>
                        <a title={`Create a ${link.title}`}>
                          <i className="las la-file"></i>
                          <span>{link.title}</span>
                        </a>
                      </Link>
                    </li>
                  )
                })}
                {createGroupTypeLinks.map(link => {
                  return (
                    <li key={link.link}>
                      <Link href={link.link}>
                        <a title={`Create ${link.title}`}>
                          <i className="las la-users"></i>
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

        i {
          font-size: 20px;
          margin-right: 5px;
          color: var(--accents-4);
        }
       
        .icon {
          fill: var(--accents-4);
          transition: 0.35s ease;
        }
        .view-more{

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
