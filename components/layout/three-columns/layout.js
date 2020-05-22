import Head from '../head/head'
import Header from '../header/header'
import Footer from '../footer/footer'
import ToolBar from '@components/generic/toolbar/toolbar'


const Layout = (props) => (
  <>
    <Head props={props} />
    <Header />

    <main
      className={` ${
        props.alt ? 'alt' : ''
      } ${props.className ? props.className : ''}`}
    >
      <div
        className={`container `}
      >

         <div className={`columns ${props.rightColumn ? 'three-columns': 'two-columns'}`}>
            <div className="left-column">
              <ToolBar />
            </div>
            <div className="center-column">
              {props.children}
            </div>
            {props.rightColumn && <div className="right-column">
              {props.rightColumn}
            </div>}
          </div>
      </div>
    </main>

    <Footer />
    <style jsx>{`
      main.alt {
        background-color: var(--accents-1);
      }
   

      .container {
        max-width: var(--empz-page-max-width);
        margin: 0 auto;
        padding: 2rem 1.25rem;
        position: relative;
      }

      @media all and (max-width: 600px) {
        .container {
          padding: var(--empz-gap-half);
        }
      }

      .columns {
        align-items: flex-start;
        display: flex;
        justify-content: space-between;
      }

      .left-column {
        width: 20%;
      }

      @media all and (max-width: 960px) {
        .left-column {
          width: 30%;
        }
      }

      .right-column {
        height: 100%;
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

      .three-columns .center-column {
        margin: 0 var(--empz-gap);
        max-width: 600px;
        width: 77%;
      }

      .two-columns .center-column {
        margin: 0 var(--empz-gap);
        flex: auto;
      }

      @media all and (max-width: 1110px) {
        .three-columns .center-column {
          width: 60%;
        }
      }

      @media all and (max-width: 960px) {
        .three-columns .center-column, .two-columns .center-column {
          margin-right: 0;
          max-width: none;
          width: calc(70% - var(--empz-gap));
        }
      }

      @media all and (max-width: 720px) {
        .three-columns .center-column, .two-columns .center-column {
          margin: 0;
          margin-left: auto;
          padding: 0;
          width: calc(100% - 80px);
        }
      }

      @media all and (max-width: 520px) {
        .three-columns .center-column, .two-columns .center-column {
          width: 100%;
        }
      }
    `}</style>
  </>
)

export default Layout
