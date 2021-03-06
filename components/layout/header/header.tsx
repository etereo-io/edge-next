import React, { memo, useState } from 'react'

import AdminHeader from './admin-sub-header'
import EdgeLogo from '../../generic/icons/edge-icon/edge-icon'
import Link from 'next/link'
import Progress from './progress'
import UserHeader from './user-header'
import { hasPermission } from '@lib/permissions'
import {
  useUser,
} from '@lib/client/hooks'

function Header() {
  const { user } = useUser()
  const showAdminNav = hasPermission(user, `admin.access`)


  const [active, setActive] = useState(false)
  

  return (
    <>
      <header className="edge-header">
        <aside className={active ? 'edge-topper hide' : 'edge-topper'}>
          <div className="edge-container">
            <p className="edge-topper-content">
              🚨 This is a site for demo purposes
            </p>
            <button
              name="close"
              aria-label="close"
              className="edge-topper-close"
              onClick={() => setActive(!active)}
            />
          </div>
        </aside>
        {showAdminNav && <AdminHeader user={user} />}
        <div className="edge-header-content">

          <div className="edge-container">
            <Link href="/">
              <a title="Home page">
                <EdgeLogo />
              </a>
            </Link>

            <UserHeader user={user} />
          </div>
          <Progress
            color="#29D"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
          />
        </div>
      </header>
      <style jsx>{`
       

        .edge-topper {
          background: var(--edge-foreground);
          color: var(--edge-background);
          font-size: 12px;
          padding: var(--edge-gap-quarter) 0;
        }

        .edge-topper.hide {
          display: none;
        }

        .edge-topper .edge-topper-content {
          font-size: 12px;
          font-weight: 500;
        }

        @media all and (max-width: 600px) {
          .edge-topper .edge-topper-content {
            max-width: 422px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .edge-topper-close {
          background: transparent;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          height: 20px;
          position: relative;
          transition: background-color 0.35s ease;
          width: 20px;
        }

        .edge-topper-close::before,
        .edge-topper-close::after {
          background: var(--edge-background);
          content: '';
          height: 2px;
          left: 50%;
          position: absolute;
          top: 50%;
          transition: background-color 0.35s ease;
          width: calc(100% - 8px);
        }

        .edge-topper-close:hover {
          background: var(--edge-background-half);
        }

        .edge-topper-close:hover.edge-topper-close::before,
        .edge-topper-close:hover.edge-topper-close::after {
          background: var(--edge-foreground);
        }

        .edge-topper-close::before {
          transform: translateY(-50%) translateX(-50%) rotate(-45deg);
        }

        .edge-topper-close::after {
          transform: translateY(-50%) translateX(-50%) rotate(45deg);
        }

        .edge-header {
          position: sticky;
          top: 0;
          z-index: var(--z-index-header);
        }

        .edge-header-content {
          align-items: center;
          background: var(--edge-background);
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
          display: flex;
          height: 80px;
        }

        .edge-container {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        @media all and (max-width: 720px) {
          .edge-header-content {
            height: 56px;
          }
        }
      `}</style>
    </>
  )
}

export default memo(Header)
