import Head from 'next/head'
import Header from '../header/header'
import Footer from '../footer/footer'
import config from '../../../lib/config'

import styles from './layout.module.scss'

const Layout = (props) => (
  <>
    <Head>
      <title>
        {props.title} - {config.title}
      </title>
      <meta
        title="description"
        content={props.description || config.description}
      />
    </Head>

    <Header />

    <main>
      <div
        className={`${styles.normalContainer} ${
          props.fullWidth ? styles.fullWidth : ''
        } ${props.className ? props.className : ''}`}
      >
        {props.children}
      </div>
    </main>

    <Footer />
  </>
)

export default Layout
