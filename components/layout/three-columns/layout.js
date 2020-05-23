import Head from '../head/head'
import Header from '../header/header'
import Footer from '../footer/footer'
import ToolBar from '@components/generic/toolbar/toolbar'

const Layout = (props) => (
  <>
    <Head props={props} />
    <Header />

    <main
      className={` ${props.alt ? 'alt' : ''} ${
        props.className ? props.className : ''
      }`}
    >
      <div className={`container `}>
        <div
          className={`columns ${
            props.rightColumn ? 'three-columns' : 'two-columns'
          }`}
        >
          <div className="left-column">
            <ToolBar />
          </div>
          <div className="center-column">
            <div className="center-column-content">{props.children}</div>
          </div>
          {props.rightColumn && (
            <div className="right-column">{props.rightColumn}</div>
          )}
        </div>
      </div>
    </main>

    <Footer />
    <style jsx>{`
      main.alt {
        background-color: var(--accents-1);
      }

      .container {
        padding: 0 32px;
        position: relative;
        margin: 0 auto;
        max-width: var(--edge-page-max-width);
        width: 100%;
      }

      @media all and (max-width: 600px) {
        .container {
          padding: var(--edge-gap-half);
        }
      }

      .columns {
        align-items: flex-start;
        display: flex;
        justify-content: space-between;
      }

      .left-column {
        height: calc(100vh - 80px - var(--edge-gap-double));
        margin: var(--edge-gap-double) 0 var(--edge-gap) 0;
        position: sticky;
        overflow-y: auto;
        top: calc(80px + var(--edge-gap));
        width: 24%;
      }

      .left-column::-webkit-scrollbar {
        width: 4px;
      }

      .left-column::-webkit-scrollbar-track {
        background: var(--accents-2);
        border-radius: 4px;
      }

      .left-column::-webkit-scrollbar-thumb {
        background: var(--accents-3);
        border-radius: 4px;
      }

      @media all and (max-width: 960px) {
        .left-column {
          width: 30%;
        }
      }

      .right-column {
        height: 100%;
        width: 24%;
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
          padding: var(--edge-gap);
          width: 100%;
        }
      }

      .three-columns .center-column {
        background: var(--accents-1);
        max-width: calc(778px + var(--edge-gap-double));
        padding: var(--edge-gap-double) var(--edge-gap);
        width: 77%;
      }

      .three-columns .center-column .center-column-content {
        background: var(--accents-1);
        margin: 0 auto;
        max-width: calc(600px + var(--edge-gap-double));
        padding: 0 var(--edge-gap);
        width: 100%;
      }

      .two-columns .center-column {
        margin: 0 var(--edge-gap);
        flex: auto;
      }

      @media all and (max-width: 1110px) {
        .three-columns .center-column {
          width: 60%;
        }
      }

      @media all and (max-width: 960px) {
        .three-columns .center-column,
        .two-columns .center-column {
          margin-right: 0;
          max-width: none;
          width: calc(70% - var(--edge-gap));
        }
      }

      @media all and (max-width: 720px) {
        .three-columns .center-column,
        .two-columns .center-column {
          margin: 0;
          margin-left: auto;
          padding: 0;
          width: calc(100% - 80px);
        }
      }

      @media all and (max-width: 520px) {
        .three-columns .center-column,
        .two-columns .center-column {
          width: 100%;
        }
      }
    `}</style>
  </>
)

export default Layout
