import Layout from '../../components/layout/admin/layout-admin'
import Map from '../../components/generic/map/map'
import { usePermission } from '../../lib/hooks'

const AdminPage = () => {
  const available = usePermission(`admin.geolocation`, '/')

  return (
    available && (
      <Layout title="Real Time Geolocation">
        <h1>Geolocation</h1>
        <Map/>
      </Layout>
    )
  )
}

export default AdminPage
