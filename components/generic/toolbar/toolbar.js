import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import { useUser } from '@lib/client/hooks'
import Button from '@components/generic/button/button'
import Avatar from '@components/user/avatar/avatar'
import ThemeSelector from '../../generic/theme-selector/theme-selector'
import Link from 'next/link'

export default function () {
  const { user, finished } = useUser()
  return (
    <>
      <aside className="edge-panel-user">
        {(!finished || user) && (
          <div className="edge-avatar-user">
            {/*Avatar*/}
            <div className="edge-avatar medium has-status available">
              <img
                className="edge-avatar-image"
                src={
                  user && user.profile && user.profile.picture
                    ? user.profile.picture.path
                    : null
                }
              />
            </div>
            <div className="edge-avatar-user-info">
              <strong className="edge-user-name">
                {user && (
                  <a title={`${user.username} profile`}>
                    {user.profile && user.profile.displayName
                      ? user.profile.displayName
                      : user.username}
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
          <div>
            <Button href="/auth/login">Sign in</Button>
          </div>
        )}

        {/*Panel User Navigation*/}
        <nav className="edge-panel-user-navigation">
          <ul>
            <li>
              <a href="#" className="edge-panel-user-navigation-item">
                <img
                  className="edge-panel-user-navigation-icon"
                  src="/refactor/icon-groups.svg"
                />
                <span className="edge-panel-user-navigation-title">
                  My Groups
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="edge-panel-user-navigation-item">
                <img
                  className="edge-panel-user-navigation-icon"
                  src="/refactor/icon-rewards.svg"
                />
                <span className="edge-panel-user-navigation-title">
                  Rewards
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="edge-panel-user-navigation-item">
                <img
                  className="edge-panel-user-navigation-icon"
                  src="/refactor/icon-courses.svg"
                />
                <span className="edge-panel-user-navigation-title">
                  Courses
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="edge-panel-user-navigation-item">
                <img
                  className="edge-panel-user-navigation-icon"
                  src="/refactor/icon-analytics.svg"
                />
                <span className="edge-panel-user-navigation-title">
                  Analytics
                </span>
              </a>
            </li>
          </ul>
        </nav>

        {/*Panel User Tags*/}
        <ul className="edge-panel-user-tags">
          <span className="edge-tag">Trending Tags</span>
          <li>
            <a className="edge-panel-user-tag-unit" href="#">
              Web Development
            </a>
          </li>
          <li>
            <a className="edge-panel-user-tag-unit" href="#">
              NextJS
            </a>
          </li>
          <li>
            <a className="edge-panel-user-tag-unit" href="#">
              New Vercel
            </a>
          </li>
          <li>
            <a className="edge-panel-user-tag-unit" href="#">
              React
            </a>
          </li>
          <li>
            <a className="edge-panel-user-tag-unit" href="#">
              Web Monetization
            </a>
          </li>
        </ul>

        <footer className="edge-panel-user-footer">
          <Link href="/p/faq">
            <a className="edge-panel-user-faqs" href="#">
              <img src="/refactor/icon-question.svg" />
            </a>
          </Link>

          <ThemeSelector />
        </footer>

        <button className="edge-panel-user-action-mobile">
          <img src="/refactor/icon-add.svg" />
        </button>
      </aside>
      <style jsx>{`
        .toolbar {
          align-items: flex-start;
          background: var(--edge-background);
          border-radius: var(--edge-radius);
          color: var(--edge-foreground);
          display: flex;
          flex-flow: column;
          padding: 0 var(--edge-gap) var(--edge-gap) 0;
        }

        .user-menu {
          margin-top: 32px;
          width: 100%;
        }

        .user-menu ul {
          display: flex;
          flex-flow: column;
          width: 100%;
        }

        .user-menu ul li {
          list-style: none;
          width: 100%;
        }

        .user-menu ul li a {
          align-items: center;
          border-radius: 4px;
          color: var(--edge-foreground);
          display: flex;
          font-size: 14px;
          color: inherit;
          transition: background 0.35s ease;
          overflow: hidden;
          padding: 16px var(--edge-gap-half);
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        .user-menu ul li a:hover {
          background: var(--accents-2);
        }

        .user-menu ul li a svg {
          height: auto;
          margin-right: 8px;
          width: 16px;
        }

        .user-menu ul li a svg path {
          fill: var(--edge-foreground);
        }

        .bottom-actions {
          align-items: center;
          display: flex;
          margin-top: var(--edge-gap-double);
          justify-content: space-between;
          width: 100%;
        }

        .bottom-actions .faqs-icon {
          width: 24px;
        }

        .mobile-over {
          align-items: center;
          display: none;
          width: 100%;
          flex-flow: column;
          justify-content: space-between;
          background: var(--edge-background);
          content: '';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          transition: opacity 0.35s ease, visibility 0.35s ease;
          width: 100%;
          z-index: 1;
        }

        .mobile-over > :global(.avatar) {
          transition: 0.35s ease;
          max-width: 80px;
          height: 80px;
          width: 100%;
        }

        .mobile-over .open-mobile-over {
          background: var(--accents-2);
          border-radius: 4px;
          height: 32px;
          margin-bottom: var(--edge-gap-double);
          position: relative;
          width: 32px;
        }

        .mobile-over .open-mobile-over::before {
          border-bottom: 2px solid var(--accents-3);
          border-right: 2px solid var(--accents-3);
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: rotate(-45deg) translate(-20%, -80%);
          display: block;
          height: var(--edge-gap-half);
          width: var(--edge-gap-half);
        }

        @media all and (max-width: 720px) {
          .mobile-over {
            display: flex;
          }
        }

        @media all and (max-width: 720px) {
          .mobile-over {
            flex-flow: row;
          }
          .mobile-over > :global(.avatar) {
            height: 40px;
            width: 40px;
          }
          .mobile-over .open-mobile-over {
            margin-bottom: 0;
            margin-right: var(--edge-gap-double);
          }
        }

        @media all and (max-width: 720px) {
          .toolbar {
            bottom: 0;
            box-shadow: var(--shadow-large);
            height: calc(100% - 80px);
            left: 0;
            overflow-x: hidden;
            overflow-y: scroll;
            position: fixed;
            top: auto;
            transition: 0.35s ease;
            max-width: 80px;
            width: 50%;
            z-index: var(--z-index-toolbar);
          }
          .toolbar::-webkit-scrollbar {
            width: 0 !important;
          }
          .toolbar {
            overflow: -moz-scrollbars-none;
          }
          .toolbar {
            -ms-overflow-style: none;
          }
          .toolbar:hover {
            max-width: 260px;
          }

          .toolbar:hover .mobile-over {
            opacity: 0;
            visibility: hidden;
          }

          .toolbar:hover > :global(.avatar) {
            border-radius: 50%;
            transform: translateY(50%);
          }
        }

        @media all and (max-width: 720px) {
          .toolbar {
            box-shadow: 0 10px 60px rgba(0, 0, 0, 0.5);
            max-height: 40px;
            max-width: none;
            padding: 0;
            width: 100vw;
          }
          .toolbar:hover {
            max-height: 100%;
            max-width: none;
            width: 100vw;
          }
        }

        .general-tags {
          border-top: 1px solid var(--accents-2);
          margin-top: var(--edge-gap);
          padding-top: var(--edge-gap);
          width: 100%;
        }

        .general-tags:before {
          content: 'Trending Tags';
          background: var(--edge-foreground);
          border-radius: 4px;
          color: var(--edge-background);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: var(--edge-gap);
          padding: 4px 8px;
          position: sticky;
          top: 0;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .general-tags ul li {
          display: block;
          list-style: none;
        }

        .general-tags ul li a {
          border-radius: 4px;
          color: var(--edge-foreground);
          display: block;
          font-size: 14px;
          padding: var(--edge-gap-half);
          color: inherit;
          transition: background 0.35s ease;
          overflow: hidden;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        .general-tags ul li a:hover {
          background: var(--accents-2);
        }
      `}</style>
    </>
  )
}
