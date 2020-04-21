import Head from 'next/head'
import Header from '../header/header'
import config from '../../../lib/config'

import styles from './layout-admin.module.scss'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {props.title} - {config.title}
      </title>
    </Head>

    <Header />

    <main>
      <div className={styles.adminContainer}>{props.children}</div>
    </main>
  </>
)

export default Layout
