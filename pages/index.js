import Layout from '@components/layout/three-panels/layout'
import Button from '@components/generic/button/button'
import Badge from '@components/generic/badge/badge'
import GithubLogo from '@components/generic/icons/github-icon/github-icon'
import NextJSLogo from '@components/generic/icons/nextjs-icon/nextjs-icon'
import Card from '@components/generic/card/card'
import Link from 'next/link'
import config from '@lib/config'
import { useContentType } from '@lib/client/hooks'
import ToolBar from '@components/generic/toolbar/toolbar'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'

const Landing = () => {
  const { contentType } = useContentType('post')

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
        .edge-panel-ads-items{
          display: flex;
          flex-flow: column;
          width: 100%;
        }
        .right-column-items {
          display: flex;
          display: none;
          flex-wrap: wrap;
          justify-content: space-between;
          position: sticky;
          top: 80px;
        }

        .call-to-action {
          display: flex;
          flex-wrap: wrap;
        }

        .call-to-action-item {
          width: calc(50% - 8px);
          margin-bottom: var(--edge-gap);
        }

        @media all and (max-width: 1180px) {
          .call-to-action-item {
            width: 100%;
          }
        }

        .call-to-action-item .top {
          margin-bottom: var(--edge-gap);
        }

        .call-to-action-item.simple svg {
          max-width: 80px;
        }

        .call-to-action-item svg path {
          fill: var(--edge-success);
        }

        .call-to-action-item.alt svg path {
          fill: var(--edge-background);
        }

        .call-to-action-item.featured {
          width: 100%;
        }

        .call-to-action-item.featured svg path {
          fill: var(--edge-success);
        }

        .call-to-action-item a {
          color: inherit;
          text-decoration: none;
        }

        .call-to-action-item svg {
          width: var(--edge-double);
        }
      `}</style>
    </>
  )
  return (
    <>
      <Layout
        title={`${config.title} - ${config.slogan}`}
        description={config.slogan}
        alt={false}
        panelAds={panelAdsItems}
        panelUser={<ToolBar />}
      >
        {contentType && <ContentListView type={contentType} />}
      </Layout>
      <style jsx>{`
        .featured-section {
          background: var(--edge-background);
          border-radius: 4px;
          box-shadow: var(--shadow-smallest);
          color: var(--edge-foreground);
          display: block;
          padding: var(--edge-gap-double);
          position: relative;
          text-align: center;
          margin-bottom: var(--edge-gap);
          width: 100%;
        }

        @media all and (max-width: 600px) {
          .featured-section {
            padding: var(--edge-gap);
          }
        }

        .featured-section .close {
          background: none;
          border: none;
          cursor: pointer;
          height: 24px;
          position: absolute;
          right: var(--edge-gap);
          top: var(--edge-gap);
          width: 24px;
        }

        .featured-section .close::before,
        .featured-section .close::after {
          background: var(--edge-background);
          content: '';
          height: 2px;
          left: 0;
          position: absolute;
          top: 50%;
          width: 100%;
        }

        .featured-section .close::before {
          transform: translateY(-50%) rotate(-45deg);
        }

        .featured-section .close::after {
          transform: translateY(-50%) rotate(45deg);
        }

        .featured-section .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--edge-gap);
        }

        .featured-section p {
          font-size: 16px;
          color: var(--accents-4);
          line-height: 1.5;
          margin-bottom: var(--edge-gap);
          margin: 0 auto;
          width: 90%;
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
