import Layout from '@components/layout/three-panels/layout'
import { useUser } from '@lib/client/hooks'
import Button from '@components/generic/button/button'
import {useState} from 'react';
import config from '@lib/config'
import { useContentType } from '@lib/client/hooks'
import ToolBar from '@components/generic/toolbar/toolbar'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'

const Landing = () => {
  const { contentType } = useContentType('post')
  const { user, finished } = useUser()
  const [active, setActive] = useState(false);

  const panelAdsItems = (
    <>
      <div className="edge-panel-ads-items">
        {/*Edge Panel Featured Content*/}
        <div className="edge-panel-ads-featured-content">
          <span className="edge-tag">Featured Content</span>
          <div className="edge-placeholder"></div>
          <div className="edge-placeholder small"></div>
          <div className="edge-placeholder small"></div>
        </div>

        {/*Edge Panel Featured Sponsors*/}
        <div className="edge-panel-ads-featured-sponsors">
          <span className="edge-tag">Featured Sponsors</span>
          <div className="edge-placeholder"></div>
          <div className="edge-placeholder small"></div>
          <div className="edge-placeholder small"></div>
        </div>
      </div>
      <style jsx>{`
        .edge-tag {
          margin-bottom: var(--edge-gap);
        }

        .edge-panel-ads-featured-sponsors {
          margin-top: var(--edge-gap-double);
        }

        .edge-placeholder {
          background-color: var(--accents-1);
          border-radius: 4px;
          height: 160px;
          margin-bottom: var(--edge-gap);
          width: 100%;
        }

        .edge-placeholder.small {
          height: 56px;
        }
      `}</style>
    </>
  )
  return (
    <>
      <Layout
        title={`${config.title} - ${config.slogan}`}
        description={config.slogan}
        panelAds={panelAdsItems}
        panelUser={<ToolBar />}
      >
        <aside className={active ? "featured-section hide" : "featured-section"}>
          <i className="hand-greet">👋</i>
          {user && (
            <h3 className="featured-section-title">
              Welcome,{' '}
              {user.profile && user.profile.displayName
                ? user.profile.displayName
                : user.username}
            </h3>
          )}
          {finished && !user && (
            <h3 className="featured-section-title">Welcome to Edge!</h3>
          )}
          <p className="featured-section-text">
            We have set up this site for demonstration purposes only. If you
            want to learn more, take a look at:
          </p>
          <div className="featured-section-buttons">
            <Button success>Main documentation</Button>
            <Button soft>React Components</Button>
          </div>
          <button className="close" onClick={() => setActive(!active)}></button>
        </aside>
        {contentType && <ContentListView type={contentType} />}
      </Layout>
      <style jsx>{`
        .featured-section {
          background: var(--edge-background);
          border-radius: var(--edge-gap-half);
          box-shadow: var(--shadow-large);
          color: var(--edge-foreground);
          display: block;
          padding: var(--edge-gap-double);
          position: relative;
          text-align: center;
          margin-bottom: var(--edge-gap);
          width: 100%;
        }

        .featured-section.hide{
          display: none;
        }

        .featured-section i {
          animation: featured-section-hi 2.5s forwards infinite;
          font-style: normal;
          font-size: 2rem;
          transform-origin: 70% 70%;
          display: inline-block;
        }

        @keyframes featured-section-hi {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(-10deg);
          }
          20% {
            transform: rotate(12deg);
          }
          30% {
            transform: rotate(-10deg);
          }
          40% {
            transform: rotate(9deg);
          }
          50% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .featured-section-title {
          font-size: 28px;
        }

        .featured-section-text {
          color: var(--accents-4);
          display: block;
          font-size: 18px;
          margin: 0 auto;
          margin-top: var(--edge-gap-half);
          max-width: 440px;
          width: 100%;
        }

        .featured-section-buttons {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          margin-top: var(--edge-gap);
          max-width: 360px;
          width: 100%;
        }

        @media all and (max-width: 600px) {
          .featured-section {
            padding: var(--edge-gap);
          }
          .featured-section-buttons {
            align-items: normal;
            flex-flow: column;
          }
          .featured-section-title {
            font-size: 24px;
          }
          .featured-section-text {
            font-size: 16px;
          }
        }

        @media all and (max-width: 600px) {
          .featured-section-title {
            font-size: 21px;
          }
          .featured-section-text {
            font-size: 14px;
          }
        }

        .featured-section .close {
          background: var(--accents-2);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          height: 32px;
          padding: 4px;
          position: absolute;
          right: var(--edge-gap);
          top: var(--edge-gap);
          width: 32px;
        }

        .featured-section .close::before,
        .featured-section .close::after {
          background: var(--edge-foreground);
          content: '';
          height: 2px;
          left: 50%;
          position: absolute;
          top: 50%;
          width: calc(100% - 16px);
        }

        .featured-section .close::before {
          transform: translateY(-50%) translateX(-50%) rotate(-45deg);
        }

        .featured-section .close::after {
          transform: translateY(-50%) translateX(-50%) rotate(45deg);
        }

        .featured-section .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--edge-gap);
        }

        .featured-section .list-title {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .featured-section .list-actions {
          align-items: center;
          display: flex;
          flex-flow: row;
          justify-content: center;
          margin-top: var(--edge-gap);
        }

        .featured-section .list-actions a {
          margin: 0 var(--edge-gap-half);
        }
      `}</style>
    </>
  )
}

export default Landing
