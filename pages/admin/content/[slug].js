import { useRouter } from 'next/router'
import { usePermission } from '../../../lib/hooks'

import { getContentTypeDefinition } from '../../../lib/config'

import TableList from '../../../components/content/admin-content/table-list/table-list'
import Layout from '../../../components/layout-admin'

import useSWR from 'swr'
import fetch from '../../../lib/fetcher'
import API from '../../../lib/api/api-endpoints'

const AdminPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const available = usePermission(`content.${slug}.admin`, '/', 'slug')

  // Load data

  const { data } = useSWR(API.content[slug], fetch)
  const contentTypeDefinition = getContentTypeDefinition(slug)
  return (
    available && (
      <Layout title="Content">
        <h1>Content administration for {slug}</h1>

        <TableList
          items={data ? data.data : []}
          loading={false}
          type={contentTypeDefinition}
        />
      </Layout>
    )
  )
}

export default AdminPage
