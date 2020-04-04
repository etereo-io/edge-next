import { useUser, usePermission} from '../../lib/hooks'
import { hasPermission } from '../../lib/permissions'
import config from '../../lib/config'
import Layout from '../../components/layout-admin'
import Link from 'next/link'

const AdminPage = () => {
  const { user } = useUser()
  const locked = usePermission('admin.access', '/')

  return (
    !locked && <Layout title="Administration area">
      <h1>Administration</h1>

      <ul>
        {hasPermission(user, `user.admin`) && (<li>
          <Link href="/admin/users">
            <a>Users</a>
          </Link>
        </li>)}
        {
          config.content.types.filter(type => {
            return hasPermission(user, `content.${type.slug}.admin`)
          })
          .map(type => {
            return (
              <li>
                <Link href={`/admin/content/${type.slug}`}>
                  <a>Administer {type.title.en}</a>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </Layout>
  )
}

export default AdminPage
