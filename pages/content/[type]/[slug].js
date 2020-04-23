import API from '../../../lib/api/api-endpoints'
import ContentDetailView from '../../../components/content/read-content/content-detail-view/content-detail-view'
import Layout from '../../../components/layout/normal/layout'
import fetch from '../../../lib/fetcher'
import { getContentTypeDefinition } from '../../../lib/config'
import { usePermission } from '../../../lib/hooks'
import { useRouter } from 'next/router'
import useSWR from 'swr'

function LoadingView() {
  return <h1>Loading...</h1>
}

// TODO: Add get static props, figure a better loading mechanism with a redirect to 404 if not found

const ContentPage = () => {
  const router = useRouter()
  const {
    query: { slug, type },
  } = router

  const contentType = getContentTypeDefinition(type)

  const available = usePermission(`content.${type}.read`, '/', 'slug')

  // Load data
  const { data } = useSWR(slug && type ? API.content[type] + '/' + slug :  null, fetch)
  
  return (
    <Layout title="Content">
      {!available && <LoadingView/> }
      {available && !data && <div className="nothing">Not found</div>}
      {available && data && <ContentDetailView type={contentType} content={data} />}
    </Layout>
  )
}

export default ContentPage
