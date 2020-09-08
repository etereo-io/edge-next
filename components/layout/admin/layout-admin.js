import Head from '../head/head'
import Header from '../header/header'
const Layout = (props) => (
  <>
    <Head {...props} />
    <Header />

    <main className="admin-layout">
      <div className="edge-container">{props.children}</div>
    </main>
    <style jsx>{`
      .admin-layout {
        background: var(--accents-1);
        min-height: 100vh;
        padding: var(--edge-gap-medium) var(--edge-gap);
      }
    `}</style>
  </>
)

export default Layout
