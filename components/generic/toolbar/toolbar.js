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
      <div className="toolbar">
        <div className="mobile-over">
          <Avatar
            loading={!finished}
            src={
              user && user.profile && user.profile.picture
                ? user.profile.picture.path
                : null
            }
          />

          <div className="open-mobile-over"></div>
        </div>
        {(!finished || user) && (
          <UserProfileBox user={user} horizontal basic small />
        )}
        {finished && !user && (
          <div>
            <Button href="/auth/login">Sign in</Button>
          </div>
        )}

        <nav className="user-menu">
          <ul>
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <defs />
                  <path
                    d="M14.2218 11.6038c.705-.5702 1.1566-1.4418 1.1566-2.417 0-1.7135-1.394-3.1076-3.1075-3.1076-.354 0-.6942.0596-1.0114.169a4.9068 4.9068 0 00-1.1932-.7852c.6418-.5697 1.0471-1.4004 1.0471-2.324 0-1.7137-1.394-3.1077-3.1075-3.1077-1.7137 0-3.1077 1.394-3.1077 3.1076 0 .9218.4036 1.751 1.043 2.3206a4.9098 4.9098 0 00-1.2.788 3.111 3.111 0 00-1.012-.1683C2.0066 6.0792.6052 7.4805.6052 9.203c0 .973.4473 1.8435 1.147 2.4169C.7007 12.28 0 13.4498 0 14.7805v.5403c0 .3433.2782.6215.6216.6215h14.7568A.6215.6215 0 0016 15.3208v-.5403c0-1.3414-.7122-2.5196-1.7782-3.1767zm-.0864-2.417c0 1.0282-.8364 1.8646-1.8645 1.8646-1.0282 0-1.8647-.8364-1.8647-1.8645 0-1.0282.8365-1.8646 1.8647-1.8646 1.0281 0 1.8645.8364 1.8645 1.8646zM8.0059 1.2744c1.028 0 1.8646.8364 1.8646 1.8646 0 1.028-.8366 1.8645-1.8646 1.8645-1.0281 0-1.8647-.8364-1.8647-1.8645 0-1.0282.8366-1.8646 1.8647-1.8646zm2.1274 5.659c-.5972.5666-.97 1.3674-.97 2.2536 0 .9751.4516 1.8467 1.1565 2.4169-1.0444.6438-1.749 1.7877-1.777 3.0954H7.4572c-.028-1.2969-.7212-2.4327-1.7514-3.0793.6997-.5734 1.147-1.4439 1.147-2.4169 0-.8945-.378-1.7023-.9825-2.2723 1.2639-.9141 2.9997-.9132 4.2629.0025zM1.8483 9.203c0-1.0371.8438-1.8807 1.8808-1.8807 1.0371 0 1.8808.8436 1.8808 1.8807 0 .9403-.6938 1.7217-1.5962 1.8591a3.8297 3.8297 0 00-.569 0c-.9026-.1374-1.5963-.9188-1.5963-1.8591zm-.604 5.4962c.0399-1.234.9837-2.243 2.1893-2.3866.0973.0092.1958.0142.2955.0142.0998 0 .1983-.005.2957-.0142 1.2055.1437 2.1493 1.1526 2.1892 2.3866H1.2444zm8.5417 0c.0431-1.3334 1.1412-2.4048 2.4849-2.4048 1.3436 0 2.4417 1.0714 2.4847 2.4048H9.786z"
                  />
                </svg>
                My groups
              </a>
            </li>
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 13 16"
                >
                  <defs />
                  <path
                    d="M11.2529 4.3727c-.2113-.5098-.063-1.5173-.7107-2.165-.6489-.6489-1.6533-.4986-2.1648-.7106C7.9038 1.3004 7.279.4687 6.3438.4687c-.9333 0-1.5632.833-2.0335 1.0282-.5098.2114-1.5173.063-2.165.7107-.649.649-.4988 1.6537-.7106 2.1647C1.2379 4.8461.4062 5.471.4062 6.406s.8318 1.5602 1.0284 2.0333c.2113.5098.063 1.5174.7107 2.1651.141.1411.2967.2408.4484.3136v4.9251c0 .4637.489.7668.9046.559l2.8455-1.4227 2.8454 1.4227c.415.2074.9046-.0948.9046-.559V10.918c.1517-.0728.3073-.1725.4484-.3136.649-.649.4987-1.6538.7107-2.1648.1964-.4734 1.0283-1.0985 1.0283-2.0336 0-.9332-.8332-1.5636-1.0283-2.0333zM8.8437 14.8319l-2.2204-1.1102a.625.625 0 00-.559 0l-2.2206 1.1102v-3.6261c.1792.0267.3426.0577.4664.1091.4735.1966 1.0986 1.0284 2.0336 1.0284.9333 0 1.5636-.8333 2.0335-1.0282.1239-.0514.2873-.0826.4665-.1093v3.6261zm1.2546-6.8713c-.2675.6451-.197 1.517-.44 1.7599-.245.245-1.1082.1698-1.7601.4399-.6393.2654-1.1798.9329-1.5545.9329-.3743 0-.915-.6674-1.5546-.933-.6556-.2717-1.513-.1929-1.76-.4398-.2437-.244-.1708-1.1113-.44-1.7603-.2654-.639-.9329-1.1797-.9329-1.5542 0-.3744.6675-.915.933-1.5547.2675-.645.197-1.5168.44-1.7598.2437-.2437 1.111-.1708 1.7601-.44.6393-.2653 1.1798-.9327 1.5545-.9327.3743 0 .915.6673 1.5546.9328.6452.2675 1.517.197 1.76.44.2438.2437.1708 1.111.44 1.76.2654.6392.9328 1.1799.9328 1.5544 0 .3744-.6674.915-.9329 1.5546z"
                  />
                </svg>
                Rewards
              </a>
            </li>
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <defs />
                  <path
                    d="M6.375 7.0312H4.6563a.625.625 0 00-.625.625v4.4063a.625.625 0 00.625.625h6.7187a.625.625 0 00.625-.625V7.6562a.625.625 0 00-.625-.625H9.6875c-.6515 0-1.2402.2746-1.6563.7141-.416-.4395-1.0047-.714-1.6562-.714zm1.0313 4.4063h-2.125V8.2812H6.375c.5686 0 1.0313.4627 1.0313 1.0313v2.125zm1.25-2.125c0-.5686.4626-1.0313 1.0312-1.0313H10.75v3.1563H8.6562v-2.125zM15.733 5.269L8.3581.1128a.625.625 0 00-.7162 0L.2669 5.269a.625.625 0 10.7163 1.0244l.5793-.405v9.4865a.625.625 0 00.625.625h11.625a.625.625 0 00.625-.625V5.8884l.5793.405a.6244.6244 0 00.8704-.154.625.625 0 00-.1541-.8704zm-2.5456 9.4809H2.8125V5.0144L8 1.3876l5.1875 3.6268V14.75z"
                  />
                </svg>
                Courses
              </a>
            </li>
            <li>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <defs />
                  <path
                    d="M8 0C3.5786 0 0 3.578 0 8c0 4.4214 3.578 8 8 8 4.4214 0 8-3.578 8-8 0-4.4214-3.578-8-8-8zm4.0625 13.3916V9.25a.625.625 0 10-1.25 0v4.8895a6.6966 6.6966 0 01-2.1875.5817v-4.5337a.625.625 0 10-1.25 0v4.5337a6.6965 6.6965 0 01-2.1875-.5817v-3.952a.625.625 0 10-1.25 0v3.2041c-1.0364-.7842-1.8545-1.8646-2.3046-3.1406l1.626-1.626H8a.625.625 0 00.442-.1831l2.3705-2.3705v.9911a.625.625 0 101.25 0v-2.5c0-.3434-.2813-.625-.625-.625h-2.5a.625.625 0 100 1.25h.991L7.7412 7.375H3a.625.625 0 00-.442.1831L1.2988 8.8173A6.873 6.873 0 011.25 8c0-3.7306 3.019-6.75 6.75-6.75 3.7306 0 6.75 3.019 6.75 6.75 0 2.1746-1.0205 4.1301-2.6875 5.3916z"
                  />
                </svg>
                Analytics
              </a>
            </li>
          </ul>
        </nav>

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
          </ul>
        </div>
        <div className="bottom-actions">
          <Link href="/p/faq">
            <a title="FAQs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="faqs-icon"
              >
                <defs />
                <path
                  fill="#BDBDBD"
                  d="M12 0C5.368 0 0 5.367 0 12c0 6.6321 5.367 12 12 12 6.6321 0 12-5.367 12-12 0-6.632-5.367-12-12-12z"
                />
                <path
                  fill="#fff"
                  d="M12 18.9141c.6472 0 1.1719-.5247 1.1719-1.1719 0-.6472-.5247-1.1719-1.1719-1.1719-.6472 0-1.1719.5247-1.1719 1.1719 0 .6472.5247 1.1719 1.1719 1.1719zM12 6.0234c-2.0678 0-3.75 1.6823-3.75 3.75 0 .5178.4197.9375.9375.9375a.9375.9375 0 00.9375-.9375c0-1.0338.8411-1.875 1.875-1.875s1.875.8412 1.875 1.875c0 1.0339-.8411 1.875-1.875 1.875a.9375.9375 0 00-.9375.9375v2.3438c0 .5178.4197.9375.9375.9375a.9375.9375 0 00.9375-.9375v-1.5249c1.6156-.4173 2.8125-1.8872 2.8125-3.6314 0-2.0677-1.6823-3.75-3.75-3.75z"
                />
              </svg>
            </a>
          </Link>
          <ThemeSelector />
        </div>
      </div>
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

        .bottom-actions{
          align-items: center;
          display: flex;
          margin-top: var(--edge-gap-double);
          justify-content: space-between;
          width: 100%;
        }

        .bottom-actions .faqs-icon{
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

        @media all and (max-width: 520px) {
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

        @media all and (max-width: 520px) {
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
