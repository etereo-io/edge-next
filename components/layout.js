import Head from 'next/head'
import Header from './header/header'
import Footer from './footer/footer'
import config from '../lib/config'

import '../styles/index.scss'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {config.title} - {props.title}
      </title>
    </Head>

    <Header />

    <main>
      <div className={`container ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </main>

    <Footer />
  </>
)

export default Layout
