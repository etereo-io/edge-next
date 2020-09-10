import ContentTable from '@components/content/admin-content/content-table/content-table'
import Layout from '@components/layout/admin/layout-admin'
import { getContentTypeDefinition } from '@lib/config'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'

const AdminPage = () => {
  const router = useRouter()
  const { slug } = router.query

  const { available } = usePermission(
    slug ? [`content.${slug}.admin`] : null,
    '/'
  )

  const contentType = getContentTypeDefinition(slug)

  // Load data
  return (
    <>

    <Layout title="Content" loading={!available || !contentType}>
      <h1>{contentType.title} administration</h1>

      <ContentTable type={contentType} />
    </Layout>
    
    <style jsx>
    {`
      h1{
        font-size: 23px;
        font-weight: 500;
        margin-bottom: 40px;
      }

      @media all and (max-width: 720px) {
          h1 {
            font-size: 18px;
          }
        }
    `}
  </style>
</>
  )
}

export default AdminPage
