import { useRouter } from 'next/router'
import ContentDetailView from '../../../components/content/read-content/content-detail-view/content-detail-view'
import ContentSummaryView from '../../../components/content/read-content/content-summary-view/content-summary-view'
import { usePermission } from '../../../lib/hooks'

import { getContentTypeDefinition } from '../../../lib/config'

import Layout from '../../../components/layout/normal/layout'

import useSWR from 'swr'
import fetch from '../../../lib/fetcher'
import API from '../../../lib/api/api-endpoints'

function LoadingView() {
  return <h1>Loading...</h1>
}

const ContentPage = () => {
  const router = useRouter()
  const {
    query: { slug, type },
  } = router

  if (!slug) {
    return <LoadingView />
  }

  const contentType = getContentTypeDefinition(type)

  const available = usePermission(`content.${type}.read`, '/', 'slug')

  // Load data
  const { data } = useSWR(API.content[type] + '/' + slug, fetch)

  return (
    available && (
      <Layout title="Content">
        <h1>Detail of {type}</h1>
        {!data && <div className="nothing">Not found</div>}
        {data && <ContentDetailView type={contentType} content={data} />}
      </Layout>
    )
  )
}

export default ContentPage
