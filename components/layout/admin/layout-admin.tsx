import Head from '../head/head'
import Header from '../header/header'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import { ReactNode } from 'react'

type PropTypes = {
  children: ReactNode,
  loading?: boolean,
  title?: string,
  description?: string
}

const Layout = ({ children, loading, ...restProps}: PropTypes) => (
  <>
    <Head {...restProps} />
    <Header />

    <main className="admin-layout">
      <div className="edge-container">
        {loading && <LoadingPage />}
        {!loading && children}
      </div>
    </main>
    <style jsx>{`
      .admin-layout {
        background: var(--accents-1-medium);
        min-height: 100vh;
        padding: var(--edge-gap-medium) var(--edge-gap);
      }
    `}</style>
  </>
)

export default Layout
