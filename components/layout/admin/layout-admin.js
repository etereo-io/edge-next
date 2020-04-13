import Head from 'next/head'
import Header from '../../header/header'
import config from '../../../lib/config'

import '../../../styles/index.scss'
import './layout-admin.scss'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {config.title} - {props.title}
      </title>
    </Head>

    <Header />

    <main>
      <div className="admin-container">{props.children}</div>
    </main>
  </>
)

export default Layout
