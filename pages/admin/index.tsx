import {
  useContentTypes,
  usePermission,
  useUser,
  useGroupTypes,
} from '@lib/client/hooks'
import Layout from '@components/layout/admin/layout-admin'
import LinkList from '@components/generic/link-list/link-list'
import { hasPermission } from '@lib/permissions'

const AdminPage = () => {
  const { user } = useUser({ redirectTo: '/' })

  const { available } = usePermission(['admin.access'], '/')

  const contentTypes = useContentTypes(['admin'])
  const groupTypes = useGroupTypes(['admin'])

  const links = []

  if (hasPermission(user, `user.admin`)) {
    links.push({
      title: 'Users',
      link: '/admin/users',
    })
  }

  if (hasPermission(user, `admin.stats`)) {
    links.push({
      title: 'Site stats',
      link: '/admin/stats',
    })
  }

  const contentLinks = contentTypes.map((type) => {
    return {
      link: `/admin/content/${type.slug}`,
      title: `Administer ${type.title}`,
    }
  })

  const groupLinks = groupTypes.map(({ slug, title }) => ({
    link: `/admin/groups/${slug}`,
    title: `Administer ${title}`,
  }))

  return (
    available && (
      <Layout title="Administration area">
        <h1>Administration</h1>
        <div className="links">
          <LinkList
            links={[...links, ...contentLinks, ...groupLinks]}
            className="space-evenly"
          />
        </div>

        <style jsx>
          {`
            h1 {
              font-size: 24px;
              font-weight: 500;
            }
            .links {
              margin-top: 5%;
            }
          `}
        </style>
      </Layout>
    )
  )
}

export default AdminPage
