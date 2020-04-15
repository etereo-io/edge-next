import { useUser, usePermission } from '../../lib/hooks'
import { hasPermission } from '../../lib/permissions'
import config from '../../lib/config'
import Layout from '../../components/layout/admin/layout-admin'
import LinkList from '../../components/link-list/link-list'
import Link from 'next/link'

const AdminPage = () => {
  const { user } = useUser()
  const available = usePermission('admin.access', '/')

  const links = []

  if(hasPermission(user, `user.admin`) ) {
    links.push(<Link href="/admin/users">
      <a>Users</a>
    </Link>)
  }

  if(hasPermission(user, `admin.stats`)){
    links.push(<Link href="/admin/stats">
      <a>Site stats</a>
    </Link>)
  }

  const contentLinks = config.content.types
  .filter((type) => {
    return hasPermission(user, `content.${type.slug}.admin`)
  })
  .map((type) => {
    return (
      <Link href={`/admin/content/${type.slug}`}>
        <a>Administer {type.title.en}</a>
      </Link>
    )
  })
  


  return (
    available && (
      <Layout title="Administration area">
        <h1>Administration</h1>
        <LinkList links={[...links, ...contentLinks]} />

      </Layout>
    )
  )
}

export default AdminPage
