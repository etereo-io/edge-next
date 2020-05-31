export default function ({ mobileCollapse = false }) {
  return (
    <>
      <nav className={`site-menu ${mobileCollapse ? 'collapse' : ''}`}>
        <ul>
          <li>
            <a href="#" className="site-menu-item">
              <img className="site-menu-icon" src="/icons/icon-groups.svg" />
              <span className="site-menu-title">My Groups</span>
            </a>
          </li>
          <li>
            <a href="#" className="site-menu-item">
              <img className="site-menu-icon" src="/icons/icon-rewards.svg" />
              <span className="site-menu-title">Rewards</span>
            </a>
          </li>
          <li>
            <a href="#" className="site-menu-item">
              <img className="site-menu-icon" src="/icons/icon-courses.svg" />
              <span className="site-menu-title">Courses</span>
            </a>
          </li>
          <li>
            <a href="#" className="site-menu-item">
              <img className="site-menu-icon" src="/icons/icon-analytics.svg" />
              <span className="site-menu-title">Analytics</span>
            </a>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .site-menu {
          padding: var(--edge-gap) 0;
        }

        .site-menu ul li {
          list-style: none;
        }

        .site-menu-item {
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

        .site-menu-item:hover {
          background-color: var(--accents-1-medium);
        }

        .site-menu-icon {
          width: 16px;
        }

        .site-menu-title {
          margin-left: var(--edge-gap-half);
        }

        @media all and (max-width: 720px) {
          .site-menu.collapse .site-menu-title {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
