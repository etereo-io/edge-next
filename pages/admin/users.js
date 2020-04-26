import Layout from '../../components/layout/admin/layout-admin'
import UserTable from '../../components/user/admin-user/user-table/user-table'
import { usePermission } from '../../lib/hooks'

const AdminPage = () => {
  const available = usePermission(`user.admin`, '/')

  return (
    available && (
      <Layout title="User administration">
        <h1>User adminsitration</h1>

        <UserTable />
      </Layout>
    )
  )
}

export default AdminPage
