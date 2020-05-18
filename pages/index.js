import Layout from '@components/layout/normal/layout'

import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import GithubLogo from '@components/generic/icons/github-icon/github-icon'
import NextJSLogo from '@components/generic/icons/nextjs-icon/nextjs-icon'

import config from '../lib/config'
import { useContentType, useUser } from '../lib/client/hooks'
import ContentListView from '@components/content/read-content/content-list-view/content-list-view'

const Landing = (props) => {
  const { contentType } = useContentType('post')
  const { user } = useUser()

  return (
    <>
      <Layout
        title={`${config.title} - ${config.slogan}`}
        description={config.slogan}
      >
        <div className="columns">
          <div className="left-column">
            <UserProfileBox user={user} />

            <div className="general-tags">
              <ul>
                <li>
                  <a href="#">#Web Development</a>
                </li>
                <li>
                  <a href="#">#Organic</a>
                </li>
                <li>
                  <a href="#">#Pachamama</a>
                </li>
                <li>
                  <a href="#">#Aceitunas gazpacha</a>
                </li>
                <li>
                  <a href="#">#Infusión de Jengibre</a>
                </li>
                <li>
                  <a href="#">#Bacalao</a>
                </li>
                <li>
                  <a href="#">#Naturaleza</a>
                </li>
                <li>
                  <a href="#">#Cerezas y alcaparras</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="center-column">
            {contentType && <ContentListView type={contentType} />}
          </div>

          <div className="right-column">
            <div className="call-to-action-item">
              <a href="/components">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.33331 0H4C1.79031 0 0 1.79031 0 4V9.33331C0 11.543 1.79031 13.3333 4 13.3333H9.33331C11.543 13.3333 13.3333 11.543 13.3333 9.33331V4C13.3333 1.79031 11.5431 0 9.33331 0ZM10.6667 9.33331C10.6667 10.0702 10.0703 10.6666 9.33337 10.6666H4C3.26306 10.6666 2.66669 10.0702 2.66669 9.33331V4C2.66669 3.26306 3.26306 2.66669 4 2.66669H9.33331C10.0702 2.66669 10.6666 3.26306 10.6666 4V9.33331H10.6667Z"
                    fill="var(--empz-success)"
                  ></path>
                  <path
                    d="M28.0001 0H22.6667C20.4571 0 18.6667 1.79031 18.6667 4V9.33331C18.6667 11.543 20.4571 13.3333 22.6667 13.3333H28.0001C30.2097 13.3333 32.0001 11.543 32.0001 9.33331V4C32.0001 1.79031 30.2097 0 28.0001 0ZM29.3334 9.33331C29.3334 10.0702 28.737 10.6666 28.0001 10.6666H22.6667C21.9298 10.6666 21.3334 10.0702 21.3334 9.33331V4C21.3334 3.26306 21.9298 2.66669 22.6667 2.66669H28.0001C28.737 2.66669 29.3334 3.26306 29.3334 4V9.33331Z"
                    fill="var(--empz-success)"
                  ></path>
                  <path
                    d="M9.33331 18.6667H4C1.79031 18.6667 0 20.4571 0 22.6667V28.0001C0 30.2097 1.79031 32.0001 4 32.0001H9.33331C11.543 32.0001 13.3333 30.2097 13.3333 28.0001V22.6667C13.3333 20.457 11.5431 18.6667 9.33331 18.6667ZM10.6667 28.0001C10.6667 28.737 10.0703 29.3334 9.33337 29.3334H4C3.26306 29.3334 2.66669 28.737 2.66669 28.0001V22.6667C2.66669 21.9298 3.26306 21.3334 4 21.3334H9.33331C10.0702 21.3334 10.6666 21.9298 10.6666 22.6667V28.0001H10.6667Z"
                    fill="var(--empz-success)"
                  ></path>
                  <path
                    d="M30.6667 24.0001H26.6667V20.0001C26.6667 19.2637 26.0698 18.6667 25.3334 18.6667C24.597 18.6667 24.0001 19.2637 24.0001 20.0001V24.0001H20.0001C19.2637 24.0001 18.6667 24.597 18.6667 25.3334C18.6667 26.0697 19.2637 26.6667 20.0001 26.6667H24.0001V30.6667C24.0001 31.4031 24.597 32 25.3334 32C26.0697 32 26.6667 31.4031 26.6667 30.6667V26.6667H30.6667C31.4031 26.6667 32 26.0697 32 25.3334C32.0001 24.597 31.4031 24.0001 30.6667 24.0001Z"
                    fill="var(--empz-success)"
                  ></path>
                </svg>
                <h6>Set of Web Components</h6>
              </a>
            </div>
            <div className="call-to-action-item alt">
              <a href="/content/post">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.3158 0.475188C24.1491 0.18125 23.8378 0 23.5 0H12.25C11.8197 0 11.4452 0.293 11.3409 0.710437L7.59087 15.7729C7.52037 16.0531 7.58356 16.3498 7.76119 16.5767C7.93881 16.8047 8.21163 16.9374 8.5 16.9374H12.7719L7.62206 30.7329C7.45725 31.1723 7.64312 31.6658 8.056 31.8883C8.47075 32.1105 8.98388 31.9916 9.25806 31.6136L24.2581 10.9261C24.4659 10.6413 24.4952 10.2641 24.3359 9.94919C24.1757 9.63519 23.8525 9.43744 23.5 9.43744H19.5312L24.3038 1.41994C24.4778 1.12975 24.4824 0.769063 24.3158 0.475188Z"
                    fill="var(--empz-background)"
                  ></path>
                </svg>
                <h6>Fast Rendering</h6>
              </a>
            </div>
            <div className="call-to-action-item featured">
              <a href="https://webmonetization.org/">
                <svg
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 40 38"
                >
                  <g fill="var(--empz-success)">
                    <path d="M13.7551 26.0833c0-1.1274-.3438-2.0559-1.0314-2.7854-.6875-.7428-1.8334-1.4059-3.4377-1.9896-1.6043-.5969-2.8521-1.1472-3.7434-1.6513-2.9667-1.658-4.45-4.1118-4.45-7.3614 0-2.2018.643-4.0123 1.929-5.4316 1.286-1.4192 2.6483-2.2217 4.851-2.487V0h3.4379v4.377c2.2154.3316 3.9279 1.3132 5.1375 2.9446 1.2097 1.6182 1.8144 3.7272 1.8144 6.3269h-4.6219c0-1.6712-.3629-2.9844-1.0887-3.9394-.7129-.9682-1.687-1.4524-2.922-1.4524-1.2224 0-2.1773.3449-2.8649 1.0346-.6875.6897-1.0313 1.6779-1.0313 2.9645 0 1.1539.3374 2.0824 1.0122 2.7854.6876.6897 1.8462 1.3463 3.476 1.9697 1.6298.6233 2.9094 1.2003 3.8389 1.7309.9295.5305 1.7125 1.1407 2.3491 1.8304.6367.6764 1.1269 1.459 1.4706 2.3477.3438.8887.5157 1.9298.5157 3.1237 0 2.2415-.6621 4.0587-1.9863 5.4514-1.3114 1.3926-2.903 2.2349-5.2585 2.4869v3.0573H7.8726v-3.0573c-2.521-.2918-4.4627-1.2335-5.825-2.8252C.6978 29.5651.023 27.4561.023 24.8298h4.641c0 1.6714.4011 2.9646 1.2033 3.8798.8149.9152 1.9608 1.3728 3.4377 1.3728 1.4515 0 2.5529-.3648 3.3042-1.0943.7639-.7295 1.1459-1.6978 1.1459-2.9048zM27.5818 15.433h-3.0622v9.2598h3.0622V15.433zM33.706 12.3464h-3.0621v15.4331h3.0621V12.3464zM39.8304 9.2598h-3.0622V30.866h3.0622V9.2598z"></path>
                  </g>
                </svg>
                <h6>Simple Web Monetization</h6>
              </a>
            </div>
            <div className="call-to-action-item simple">
              <a
                href="https://nextjs.org/"
                title="NextJS website"
                rel="noopener"
                target="_blank"
              >
                <span>Powered by</span>
                <NextJSLogo width="80px" />
              </a>
            </div>

            <div className="call-to-action-item simple">
              <a
                href="https://github.com/nucleo-org/edge-next"
                rel="noopener"
                target="_blank"
                title="Source code"
              >
                <span>Clone from</span>
                <GithubLogo width="40px" />
              </a>
            </div>
          </div>
        </div>
      </Layout>
      <style jsx>{`
        .columns {
          align-items: flex-start;
          background: var(--accents-1);
          display: flex;
          justify-content: space-between;
        }

        .left-column {
          align-items: center;
          background: var(--empz-background);
          border-radius: var(--empz-radius);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          color: var(--empz-foreground);
          display: flex;
          flex-flow: column;
          padding: var(--empz-gap);
          position: sticky;
          top: 80px;
          width: 20%;
        }

        @media all and (max-width: 960px){
          .left-column{
            width: 30%;
          }
        }

        @media all and (max-width: 720px){
          .left-column{
            bottom: 0;
            box-shadow: var(--shadow-large);
            height: calc(100% - 56px);
            left: 0;
            overflow-x: hidden;
            overflow-y: scroll;
            position: fixed;
            top: auto;
            transition: 0.35s ease;
            max-width: 80px;
            width: 50%;
            z-index: 2;
          }
          .left-column:hover{
            max-width: 210px;
          }

          .left-column:hover:before{
            opacity: 0;
            visibility: hidden;
          }

          .left-column:before{
            background: var(--empz-background);
            content: '';
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            transition: opacity 0.35s ease, visibility 0.35s ease;
            width: 100%;
          }
        }

        @media all and (max-width: 520px){
          .left-column{
            max-height: 40px;
            max-width: none;
            width: 100vw;
          }
          .left-column:hover{
            max-height: 100%;
            max-width: none;
            width: 100vw;
          }
        }

        .right-column {
          display: flex;
          flex-wrap: wrap;
          height: 100%;
          justify-content: space-between;
          position: sticky;
          top: 80px;
          width: 28.5%;
        }

        @media all and (max-width: 1180px) {
          .right-column {
            width: 18%;
          }
        }

        @media all and (max-width: 960px) {
          .right-column {
            display: none;
          }
        }

        @media all and (max-width: 600px) {
          .right-column {
            padding: var(--empz-gap);
            width: 100%;
          }
        }

        .center-column {
          margin: 0 var(--empz-gap);
          max-width: 600px;
          width: 77%;
        }

        @media all and (max-width: 1110px) {
          .center-column{
            width: 60%;
          }
        }

        @media all and (max-width: 960px) {
          .center-column{
            margin-right: 0;
            max-width: none;
            width: calc(70% - var(--empz-gap));
          }
        }

        @media all and (max-width: 720px) {
          .center-column {
            margin: 0;
            margin-left: auto;
            padding: 0;
            width: calc(100% - 80px);
          }
        }



        @media all and (max-width: 520px){
          .center-column{
            width: 100%;
          }
        }

        .call-to-action {
          display: flex;
          flex-wrap: wrap;
        }

        .call-to-action-item {
          background: var(--empz-background);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          margin-bottom: var(--empz-gap);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          width: calc(50% - 8px);
          will-change: box-shadow, transform;
        }

        @media all and (max-width: 1180px) {
          .call-to-action-item {
            width: 100%;
          }
        }

        @media all and (max-width: 860px) {
          .call-to-action-item:hover {
            transform: scale(1.05) !important;
          }
        }

        .call-to-action-item:hover {
          box-shadow: var(--shadow-medium);
          transform: scale(1.1);
        }

        .call-to-action-item.alt {
          background: var(--empz-success);
          color: var(--empz-background);
        }

        .call-to-action-item.simple span {
          background: var(--empz-foreground);
          border-radius: 4px;
          color: var(--empz-background);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: var(--empz-gap);
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .call-to-action-item.simple svg {
          max-width: 80px;
        }

        .call-to-action-item.alt svg path {
          fill: var(--empz-background);
        }

        .call-to-action-item.featured {
          background: var(--empz-foreground);
          width: 100%;
        }

        .call-to-action-item.featured h6,
        .call-to-action-item.featured p {
          color: var(--empz-background);
        }

        .call-to-action-item.featured svg path {
          fill: var(--empz-success);
        }

        .call-to-action-item a {
          color: inherit;
          display: block;
          height: 100%;
          padding: 16px;
          text-decoration: none;
          width: 100%;
        }

        .call-to-action-item svg {
          width: var(--empz-double);
        }

        .call-to-action-item h6 {
          color: var(--empz-foreground);
          display: block;
          font-size: 18px;
          margin: var(--empz-gap) 0 var(--empz-gap-half);
        }

        .call-to-action-item p {
          color: var(--empz-foreground);
          font-size: 14px;
          line-height: 1.5;
        }

        .badges {
          display: flex;
          align-items: center;
          justify-content: space-around;
          max-width: 300px;
          margin: 0 auto;
          margin-top: 90px;
        }

        .powered-by,
        .source-code {
          color: var(--empz-foreground);
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: var(--empz-gap-double);
        }

        .source-code a,
        .powered-by a {
          color: var(--empz-foreground);
        }

        h2 {
          text-align: center;
        }

        .general-tags {
          border-top: 1px solid var(--accents-2);
          margin-top: var(--empz-gap);
          padding-top: var(--empz-gap);
          width: 100%;
        }

        .general-tags:before {
          content: 'Trending Tags';
          background: var(--empz-foreground);
          border-radius: 4px;
          color: var(--empz-background);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: var(--empz-gap);
          padding: 4px 8px;
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
          color: var(--empz-foreground);
          display: block;
          font-size: 14px;
          padding: var(--empz-gap-half);
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

export default Landing
