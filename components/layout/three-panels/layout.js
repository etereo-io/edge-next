import Head from '../head/head'
import Header from '../header/header'
import Footer from '../footer/footer'

const Layout = (props) => (
  <>
    <Head {...props}/>
    <Header />

    <div
      className={`edge-panels ${
        props.panelAds ? 'three-panels' : 'two-panels'
      } edge-container`}
    >
      {props.panelUser}
      <div className="edge-panel-content">
        <div className="edge-panel-content-inner">{props.children}</div>
      </div>
      {props.panelAds && (
        <aside className="edge-panel-ads">{props.panelAds}</aside>
      )}
    </div>

    <Footer />
    <style jsx>{`
      /*Edge panels*/
      .edge-panels {
        align-items: flex-start;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
      }

      .edge-panels-three-panels .edge-panel-user,
      .edge-panels-three-panels .edge-panel-ads {
        height: fit-content;
        padding: var(--edge-gap-medium) 0;
        position: sticky;
        top: 80px;
        height: calc(100vh - 80px);
        max-width: 232px;
      }

      /* Three panels*/

      .edge-panels.three-panels {
        display: grid;
        grid-template-columns: 0.25fr 1fr 0.25fr;
        grid-template-rows: 0.5fr;
        gap: 0;
        grid-template-areas: 'edge-panel-user edge-panel-content edge-panel-ads';
      }

      @media all and (max-width: 960px) {
        .edge-panels.three-panels {
          grid-template-columns: 0.3fr 1fr;
          grid-template-areas: 'edge-panel-user edge-panel-content';
          padding-right: 0;
        }
      }

      @media all and (max-width: 720px) {
        .edge-panels.three-panels {
          gap: 0;
          grid-template-columns: auto 1fr;
        }

        .edge-panel-user-navigation-title,
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
      }

      /* Two Panels */

      .edge-panels.two-panels {
        display: grid;
        grid-template-columns: 0.25fr 1.25fr;
        grid-template-rows: 0.5fr;
        gap: 0;
        grid-template-areas: 'edge-panel-user edge-panel-content';
      }

      @media all and (max-width: 960px) {
        .edge-panels.two-panels {
          grid-template-columns: 0.3fr 1fr;
          grid-template-areas: 'edge-panel-user edge-panel-content';
          padding-right: 0;
        }
      }

      .edge-panels .edge-panel-user {
        height: fit-content;
        position: sticky;
        top: 80px;
        height: calc(100vh - 80px);
        max-width: 232px;
      }

      .edge-panels .edge-panel-content {
        background: var(--accents-1);
        grid-area: edge-panel-content;
        padding: var(--edge-gap-medium) var(--edge-gap);
        height: 100%;
      }

      /*@media all and (max-width: 720px){
        .edge-panels .edge-panel-content {
          padding: 0;
        }
      }*/

      @media all and (max-width: 460px){
        .edge-panels .edge-panel-content {
          padding: var(--edge-gap-half) 0;
        }
      }

      .edge-panels .edge-panel-content .edge-panel-content-inner {
        margin: 0 auto;
        max-width: 600px;
      }

      .edge-panels.two-panels .edge-panel-content .edge-panel-content-inner {
        margin: 0 auto;
        max-width: 890px;
      }

      @media all and (max-width: 720px) {
        .edge-panels.two-panels {
          gap: 0;
          grid-template-columns: auto 1fr;
        }

        .edge-panels.two-panels .edge-panel-user-navigation-title,
        .edge-panels.two-panels .edge-panel-user-footer {
          display: none;
        }
        .edge-panels.two-panels .edge-panel-user {
          align-items: center;
          display: flex;
          flex-flow: column;
          min-height: calc(100vh - 56px);
          top: 56px;
          transform: translateX(-$edge-gap-triple / 2);
        }
        .edge-panels.two-panels .edge-panel-user-tags {
          display: none;
        }
      }

      @media all and (max-width: 460px) {
        .edge-panels.two-panels {
          padding-left: 0;
        }
        .edge-panels.two-panels .edge-panel-user {
          transform: none;
        }
      }

      /* General */

      main.alt {
        background-color: var(--accents-1);
      }

      .edge-panel-ads {
        grid-area: edge-panel-ads;
        height: fit-content;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--edge-gap-double) 0 var(--edge-gap-double) var(--edge-gap);
        position: sticky;
        top: 80px;
        height: calc(100vh - 80px);
        max-width: 232px;
      }

      .edge-panel-ads::-webkit-scrollbar {
        width: 0;
      }

      @media all and (max-width: 960px) {
        .edge-panel-ads {
          display: none;
        }
      }
    `}</style>
  </>
)

export default Layout
