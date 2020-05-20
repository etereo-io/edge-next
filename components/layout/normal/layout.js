import Head from 'next/head'
import Header from '../header/header'
import Footer from '../footer/footer'
import config from '@lib/config'

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
      { props.monetization && <meta
        name="monetization"
        content={props.monetization}
      />}
    </Head>

    <Header />

    <main
      className={`${props.hasDivider ? 'has-divider' : ''} ${props.alt ? 'alt' : ''} ${
        props.className ? props.className : ''
      }`}
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
      main.has-divider{
        position: relative;
      }

      main.has-divider:before{
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

      .fullWidth {
        max-width: none;
        padding: 0;
      }
    `}</style>
  </>
)

export default Layout
