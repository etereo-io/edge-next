import Head from '../head/head'
import Header from '../header/header'
const Layout = (props) => (
  <>
    <Head {...props} />
    <Header />

    <main>
      <div className="edge-container">{props.children}</div>
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
