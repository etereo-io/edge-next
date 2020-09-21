import Cookies from '../../generic/cookies'
import Footer from '../footer/footer'
import Head from '../head/head'
import Header from '../header/header'

const Layout = (props) => (
  <>
    <Head {...props} />
    <Header />

    <div
      className={`edge-panels ${
        props.panelAds ? 'three-panels' : 'two-panels'
      } edge-container`}
    > 
      <div className="edge-panel-user">
        {props.panelUser}
      </div>
      <div className="edge-panel-content">
        <div className="edge-panel-content-inner">{props.children}</div>
      </div>
      {props.panelAds && (
        <aside className="edge-panel-ads">{props.panelAds}</aside>
      )}
    </div>
    
    <Footer />
    <Cookies />
    <style jsx>{`
      /*Edge panels*/
      .edge-panels {
        align-items: flex-start;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        margin: 0 auto;
        max-width: 1292px;
        width: 100%;
      }

      

      .edge-panel-user {
        background: var(--edge-background);
        display: flex;
        flex-flow: column;
        grid-area: edge-panel-user;
        max-width: 232px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--edge-gap-medium) var(--edge-gap) var(--edge-gap-medium) var(--edge-gap);
        position: sticky;
        height: calc(100vh);  
      }
      
      .edge-panel-user::-webkit-scrollbar {
        width: 0;
      }

      @media all and (max-width: 720px) {
        .edge-panel-user {
          top: 80px;
          padding: var(--edge-gap) 0;
          transform: translateX(-12px);
        }
      }

      @media all and (max-width: 460px) {
        .edge-panel-user {
          display: none;
          transform: none;
        }
      }


      /* Three panels*/

      .edge-panels.three-panels {
        display: grid;
        grid-template-columns: 0.25fr minmax(0, 1fr) 0.25fr;
        grid-template-rows: 0.5fr;
        gap: 0;
        grid-template-areas: 'edge-panel-user edge-panel-content edge-panel-ads';
      }
      
      .edge-panels-three-panels .edge-panel-user,
      .edge-panels-three-panels .edge-panel-ads {
        height: fit-content;
        padding: var(--edge-gap-medium) 0;
        position: sticky;
        height: calc(100vh);
        max-width: 323px;
      }

      @media all and (max-width: 960px) {
        .edge-panels.three-panels {
          grid-template-columns: 0.3fr minmax(0, 1fr);
          grid-template-areas: 'edge-panel-user edge-panel-content';
          padding-right: 0;
        }
      }

      @media all and (max-width: 720px) {
        .edge-panels.three-panels {
          gap: 0;
          grid-template-columns: auto minmax(0, 1fr);
        }
      }

      @media all and (max-width: 460px) {
        .edge-panels.three-panels {
          padding-left: 0;
        }

      }

      /* Two Panels */

      .edge-panels.two-panels {
        display: grid;
        grid-template-columns: 0.25fr minmax(0, 1.25fr);
        grid-template-rows: 0.5fr;
        gap: 0;
        grid-template-areas: 'edge-panel-user edge-panel-content';
      }

      @media all and (max-width: 960px) {
        .edge-panels.two-panels {
          grid-template-columns: 0.3fr minmax(0, 1fr);
          grid-template-areas: 'edge-panel-user edge-panel-content';
          padding-right: 0;
        }
      }

      .edge-panels .edge-panel-content {
        grid-area: edge-panel-content;
        padding: var(--edge-gap-medium) var(--edge-gap);
        height: 100%;
        background: var(--accents-1);
      }

      @media all and (max-width: 460px) {
        .edge-panels .edge-panel-content {
          padding: var(--edge-gap-half) 0;
        }
      }

      .edge-panels .edge-panel-content .edge-panel-content-inner {
        margin: 0 auto;
        max-width: 640px;
      }

      .edge-panels.two-panels .edge-panel-content .edge-panel-content-inner {
        margin: 0 auto;
        max-width: 890px;
      }

      @media all and (max-width: 720px) {
        .edge-panels.two-panels {
          gap: 0;
          grid-template-columns: auto minmax(0, 1fr);
        }

        .edge-panels.two-panels .edge-panel-user {
          align-items: center;
          display: flex;
          flex-flow: column;
          min-height: calc(100vh - 56px);
          top: 56px;
          transform: translateX(-$edge-gap-triple / 2);
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
        height: calc(100vh - 112px);
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--edge-gap-medium) 0 var(--edge-gap-medium) var(--edge-gap);
        position: sticky;
        top: 112px;
        max-width: 232px;
        padding-right: var(--edge-gap);
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
