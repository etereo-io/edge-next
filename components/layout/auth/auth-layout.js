import Head from 'next/head'
import Header from '../header/header'
import Footer from '../footer/footer'
import config from '../../../lib/config'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {props.title} - {config.title}
      </title>
      <meta
        name="description"
        content={props.description || config.description}
      />
    </Head>

    <Header />

    <main>
      <div
        className={`container ${props.fullWidth ? 'fullWidth' : ''} ${
          props.className ? props.className : ''
        }`}
      >
        <div className="auth-view-wrapper">
          <strong className="auth-title">{props.title}</strong>
          <div className="auth-view">
            {props.children}
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <style jsx>{`
      .container {
        max-width: var(--empz-page-max-width);
        margin: 0 auto;
        padding: 2rem 1.25rem;
      }

      .fullWidth {
        max-width: none;
        padding: 0;
      }

      .auth-view-wrapper {
        padding: var(--empz-gap-double) 0;
        position: relative;
        width: 100%;
      }

      .auth-view-wrapper::before {
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

      .auth-view {
        background: var(--empz-background);
        border-radius: 4px;
        box-shadow: var(--shadow-large);
        padding: var(--empz-gap-medium);
        position: relative;
        margin: 0 auto;
        max-width: 480px;
      }

      .auth-title {
        color: var(--empz-foreground);
        display: block;
        font-size: 32px;
        font-weight: 500;
        margin: 0 auto var(--empz-gap-medium) auto;
        max-width: 480px;
        position: relative;
        text-align: center;
      }
    `}</style>
  </>
)

export default Layout
