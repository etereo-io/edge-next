import { usePermission } from '../../../lib/hooks'
import Layout from '../../../components/layout-admin'
import { useRouter } from 'next/router'
import TableList from '../../../components/content/admin-content/table-list/table-list'

import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import API from '../../../lib/api/api-endpoints'

const fetcher = (url) => fetch(url).then((r) => r.json())

const AdminPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const locked = usePermission(`content.${slug}.admin`, '/', 'slug')

  // Load data

  const { data } = useSWR(API.content[slug], fetcher)

  return (
    !locked && (
      <Layout title="Content">
        <h1>Content administration for {slug}</h1>

        <TableList items={data || []} loading={false} />
      </Layout>
    )
  )
}

export default AdminPage
