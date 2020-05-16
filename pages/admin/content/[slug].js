import { useContentType, usePermission } from '../../../lib/client/hooks'

import ContentTable from '../../../components/content/admin-content/content-table/content-table'
import Layout from '../../../components/layout/admin/layout-admin'
import { useRouter } from 'next/router'

const AdminPage = () => {
  const router = useRouter()
  const { slug } = router.query

  const { available } = usePermission(
    slug ? [`content.${slug}.admin`] : null,
    '/'
  )

  const {contentType} = useContentType(slug ? slug: null)

  // Load data
  return (
    available && (
      <Layout title="Content">
        <h1>Content administration for {slug}</h1>

        <ContentTable type={contentType} />
      </Layout>
    )
  )
}

export default AdminPage
