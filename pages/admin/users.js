import { usePermission } from '../../lib/hooks'
import Layout from '../../components/layout-admin'
import TableList from '../../components/content/admin-content/table-list/table-list'

import useSWR from 'swr'
import fetch from '../../lib/fetcher'

import API from '../../lib/api/api-endpoints'

const fetcher = (url) => fetch(url).then((r) => r.json())

const AdminPage = () => {
  
  const locked = usePermission(`user.admin`, '/')

  // Load data
  const { data } = useSWR(API.users, fetch)

  return (
    !locked && (
      <Layout title="User administration">
        <h1>User adminsitration</h1>

        <TableList items={data} loading={false} />
      </Layout>
    )
  )
}

export default AdminPage
