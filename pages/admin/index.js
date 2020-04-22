import { usePermission, useUser } from '../../lib/hooks'

import Layout from '../../components/layout/admin/layout-admin'
import LinkList from '../../components/generic/link-list/link-list'
import config from '../../lib/config'
import { hasPermission } from '../../lib/permissions'

const AdminPage = () => {
  const { user } = useUser()
  const available = usePermission('admin.access', '/')

  const links = []

  if(hasPermission(user, `user.admin`) ) {
    
    links.push({
      title: 'Users',
      link: '/admin/users'
    })
  }

  if(hasPermission(user, `admin.stats`)){
    links.push({
      title: 'Site stats',
      link: '/admin/stats'
    })
  }

  const contentLinks = config.content.types
  .filter((type) => {
    return hasPermission(user, `content.${type.slug}.admin`)
  })
  .map((type) => {
     return {
        link: `/admin/content/${type.slug}`,
        title: `Administer ${type.title.en}s`
      }
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
