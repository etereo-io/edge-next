import Head from 'next/head'
import Header from '../header/header'
import config from '../../../lib/config'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {props.title} - {config.title}
      </title>
    </Head>

    <Header />

    <main>
      <div className='admin-container'>{props.children}</div>
    </main>
  <style jsx>{`
  .admin-container {
    max-width: 95vw;
    min-height: 100vh;
    margin: 0 auto;
    padding: 2rem 1.25rem;
  }

  `}</style>
  </>
)

export default Layout
