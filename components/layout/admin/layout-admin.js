import Head from 'next/head'
import Header from '../../header/header'
import config from '../../../lib/config'

import syles from './layout-admin.module.scss'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {config.title} - {props.title}
      </title>
    </Head>

    <Header />

    <main>
      <div className={styles.adminContainer}>{props.children}</div>
    </main>
  </>
)

export default Layout
