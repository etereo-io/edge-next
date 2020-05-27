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
            <Avatar width={'32px'} src={
                  user && user.profile && user.profile.picture
                    ? user.profile.picture.path
                    : null
                } />
            
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
          <div className="not-logged">
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
                  src="/icons/icon-groups.svg"
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
                  src="/icons/icon-rewards.svg"
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
                  src="/icons/icon-courses.svg"
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
                  src="/icons/icon-analytics.svg"
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
              <img src="/icons/icon-question.svg" />
            </a>
          </Link>

          <ThemeSelector />
        </footer>

        <button className="edge-panel-user-action-mobile">
          <img src="/icons/icon-add.svg" />
        </button>
      </aside>
      <style jsx>{`
        /*Edge Panel User*/
        .edge-panel-user {
          display: flex;
          flex-flow: column;
          grid-area: edge-panel-user;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--edge-gap-double) 0;
          height: 100%;
        }

        .edge-panel-user {
          height: fit-content;
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          max-width: 232px;
        }

        @media all and (max-width: 720px) {
          .edge-panel-user {
            padding: var(--edge-gap) 0;
          }

          .not-logged{
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
          width: $edge-gap-triple;
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
          font-size: 14px;
          font-weight: 500;
          max-width: 164px;
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
          background-color: var(--accents-2);
        }

        .edge-panel-user-navigation {
          padding: var(--edge-gap) 0;
        }

        .edge-panel-user-navigation ul li {
          list-style: none;
        }

        .edge-panel-user-navigation-item {
          align-items: center;
          border-radius: 4px;
          display: flex;
          font-size: 14px;
          font-weight: 500;
          padding: 16px;
          text-decoration: none;
          transition: background-color 0.35s ease;
          will-change: background-color;
        }

        .edge-panel-user-navigation-item:hover {
          background-color: var(--accents-);
        }

        .edge-panel-user-navigation-icon {
          width: 16px;
        }

        .edge-panel-user-navigation-title {
          margin-left: var(--edge-gap-half);
        }

        @media all and (max-width: 720px) {
          .edge-panel-user-navigation-title,
          .edge-panel-user .edge-avatar-user-info,
          .edge-panel-user-footer {
            display: none;
          }
          .edge-panel-user {
            align-items: center;
            display: flex;
            flex-flow: column;
            min-height: calc(100vh - 56px);
            top: 56px;
            transform: translateX(-12px);
          }
          .edge-panel-user-tags {
            display: none;
          }
        }

        @media all and (max-width: 460px) {
          .edge-panels.three-panels {
            padding-left: 0;
          }
          .edge-panel-user {
            transform: none;
          }
          .edge-panel-user .edge-avatar-image {
            height: 32px;
            width: 32px;
          }
        }
      `}</style>
    </>
  )
}
