import Avatar from '@components/user/avatar/avatar'
import Button from '@components/generic/button/button'
import Link from 'next/link'
import LoadingPlaceholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import SiteMenu from '@components/generic/site-menu/site-menu'
import ThemeSelector from '@components/generic/theme-selector/theme-selector'
import { memo } from 'react'
import { useUser } from '@lib/client/hooks'

function ToolBar() {
  const { user, finished } = useUser()
  return (
    <>
      <aside className="toolbar">
        {!finished && (
          <div className="edge-avatar-user">
            <LoadingPlaceholder width="100%" height="30px" />
          </div>
        )}
        {user && (
          <div className="edge-avatar-user">
            <Avatar width={'32px'} user={user} />

            <div className="edge-avatar-user-info">
              <strong className="edge-user-name">
                {user && (
                  <a title={`${user.username} profile`}>
                    {user?.profile?.displayName || user.username}
                  </a>
                )}
              </strong>
              <small className="edge-user-alias">
                {user && (
                  <a title={`${user.username} profile`}>
                    @{user.profile && user.username}
                  </a>
                )}
              </small>
            </div>
          </div>
        )}
        {finished && !user && (
          <div className="not-logged">
            <Button href="/auth/login">Login</Button>
          </div>
        )}

        <SiteMenu mobileCollapse={true} />

        <ul className="edge-panel-user-tags">
          <span className="edge-tag">Trending Tags</span>
          <li>
            <Link href="/content/post?tags=web-development">
              <a className="edge-panel-user-tag-unit">Web Development</a>
            </Link>
          </li>
          <li>
            <Link href="/content/post?tags=nextjs">
              <a className="edge-panel-user-tag-unit">NextJS</a>
            </Link>
          </li>
        </ul>

        <footer className="edge-panel-user-footer">
          <Link href="/p/faq">
            <a className="edge-panel-user-faqs">
              <img src="/icons/icon-question.svg" alt="question mark" />
            </a>
          </Link>

          <ThemeSelector />
        </footer>

        <button className="edge-panel-user-action-mobile">
          <img src="/icons/icon-add.svg" alt="add"/>
        </button>
      </aside>
      <style jsx>{`
        /*Edge Panel User*/
        .toolbar {
          display: flex;
          flex-flow: column;
        }

        .not-logged {
          display: flex;
          justify-content: center;
        }

        @media all and (max-width: 460px) {
          .not-logged {
            display: none;
          }
        }

        /*Edge Panel User Footer*/

        .edge-panel-user-footer {
          align-items: center;
          display: flex;
          height: fit-content;
          margin-top: auto;
          justify-content: space-between;
        }

        .edge-panel-user-faqs {
          margin-right: var(--edge-gap);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
        }

        .edge-panel-user-faqs img {
          width: 100%;
        }

        .edge-panel-user-footer select {
          border: 1px solid #bdbdbd;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          position: relative;
          transition: border-color 0.35s ease;
          will-change: border-color;
          width: fit-content;
        }

        /*Edge Mobile Action*/
        .edge-panel-user-action-mobile {
          align-items: center;
          background: $edge-blue;
          border: none;
          border-radius: $edge-gap;
          display: none;
          justify-content: center;
          margin-top: auto;
          padding: $edge-gap;
        }
        .edge-panel-user-action-mobile img {
          width: $edge-gap-double;
        }

        @media all and (max-width: 460px) {
          .edge-panel-user-action-mobile {
            display: flex;
          }
        }

        /*Panel User Tags*/
        .edge-panel-user-tags .edge-tag {
          margin-bottom: var(--edge-gap);
        }

        .edge-panel-user-tags li {
          list-style: none;
        }

        .edge-panel-user-tag-unit {
          border-radius: 4px;
          display: block;
          font-size: 12px;
          font-weight: 500;
          overflow: hidden;
          padding: 16px;
          text-decoration: none;
          text-overflow: ellipsis;
          transition: background-color 0.35s ease;
          will-change: background-color;
          white-space: nowrap;
        }

        .edge-panel-user-tag-unit:before {
          content: '#';
        }

        .edge-panel-user-tag-unit:hover {
          background-color: var(--accents-1-medium);
        }

        @media all and (max-width: 720px) {
          .toolbar .edge-avatar-user-info,
          .edge-panel-user-footer {
            display: none;
          }
          .toolbar {
            align-items: center;
            display: flex;
            flex-flow: column;
          }
          .edge-panel-user-tags {
            display: none;
          }
        }

        @media all and (max-width: 460px) {
          .edge-panel-user .edge-avatar-image {
            height: 32px;
            width: 32px;
          }
        }
      `}</style>
    </>
  )
}

export default memo(ToolBar)
