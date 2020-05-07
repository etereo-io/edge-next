import ContentTable from '../../../components/content/admin-content/content-table/content-table'
import Layout from '../../../components/layout/admin/layout-admin'
import { getContentTypeDefinition } from '../../../lib/config'
import { usePermission } from '../../../lib/hooks'
import { useRouter } from 'next/router'

const AdminPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const { available } = usePermission(
    slug ? [`content.${slug}.admin`] : null,
    '/'
  )

  // Load data
  const contentTypeDefinition = getContentTypeDefinition(slug)
  return (
    available && (
      <Layout title="Content">
        <h1>Content administration for {slug}</h1>

        <ContentTable type={contentTypeDefinition} />
      </Layout>
    )
  )
}

export default AdminPage
