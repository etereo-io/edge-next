import Layout from '@components/layout/normal/layout'
import LinkList from '@components/generic/link-list/link-list'

export default function Custom404() {
  const links = [
    {
      title: 'Home page',
      link: '/',
    },
  ]
  return (
    <Layout title="404">
      <div className="page page-404">
        <h1>404 - Page Not Found</h1>
        <div className="links">
          <LinkList links={links} />
        </div>

        <style jsx>{`
          h1 {
            max-width: 42rem;
            margin: 0 auto;
            padding: 1rem;
            border: var(--light-border);
            border-radius: var(--empz-radius);
            text-align: center;
          }

          .page-404 {
            margin-top: 100px;
            margin-bottom: 400px;
          }

          .links {
            display: flex;
            justify-content: center;
            margin-top: var(--empz-gap);
          }
        `}</style>
      </div>
    </Layout>
  )
}
