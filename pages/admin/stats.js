import Layout from '@components/layout/admin/layout-admin'
import { usePermission } from '@lib/client/hooks'

const AdminPage = () => {
  const { available } = usePermission([`admin.stats`], '/')

  return (
    available && (
      <Layout title="Stats">
        <h1>Site Stats</h1>
      </Layout>
    )
  )
}

export default AdminPage
