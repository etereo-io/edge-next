import Head from '../head/head'
import Header from '../header/header'
import Footer from '../footer/footer'

const Layout = (props) => (
  <>
    <Head props={props} />
    <Header />

    <main
      className={`${props.hasDivider ? 'has-divider' : ''} ${
        props.alt ? 'alt' : ''
      } ${props.className ? props.className : ''}`}
    >
      <div
        className={`container ${props.fullWidth ? 'fullWidth' : ''} ${
          props.className ? props.className : ''
        }`}
      >
        {props.children}
      </div>
    </main>

    <Footer />
    <style jsx>{`
      main.alt {
        background-color: var(--accents-1);
      }
      main.has-divider {
        position: relative;
      }

      main.has-divider:before {
        background: var(--accents-1);
        border-bottom: 1px solid var(--accents-2);
        content: '';
        height: 50%;
        max-height: 280px;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }

      .container{
        padding: 0 32px;
        position: relative;
        margin: 0 auto;
        max-width: var(--edge-page-max-width);
        width: 100%;
      }

      @media all and (max-width: 720px) {
        .container {
          padding: var(--edge-gap-half);
        }
      }

      .fullWidth {
        max-width: none;
        padding: 0;
      }
    `}</style>
  </>
)

export default Layout
