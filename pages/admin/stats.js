import { usePermission } from '../../lib/hooks'
import Layout from '../../components/layout-admin'

const AdminPage = () => {
  const locked = usePermission(`admin.stats`, '/')

  return (
    !locked && (
      <Layout title="Stats">
        <h1>Site Stats</h1>
      </Layout>
    )
  )
}

export default AdminPage
