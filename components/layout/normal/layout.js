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
        {props.children}
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
    `}</style>
  </>
)

export default Layout
