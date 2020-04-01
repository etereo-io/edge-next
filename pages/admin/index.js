import { useUser } from '../../lib/hooks'
import Layout from '../../components/layout'
import Link from 'next/link'

const AdminPage = () => {
  const user = useUser()

  return (
    <Layout>
      <h1>Admin page</h1>

      <ul>
        <li>
          <Link href="/admin/users">
            <a>Users</a>
          </Link>
        </li>
        <li>
          <Link href="/admin/content/type">
            <a>Manage: Type</a>
          </Link>
        </li>
      </ul>
     
    
    </Layout>
  )
}

export default AdminPage
