import ContentListView from '../../components/content/read-content/content-list-view/content-list-view'
import Layout from '../../components/layout/normal/layout'
import { getContentTypeDefinition } from '../../lib/config'
import { usePermission } from '../../lib/hooks'
import { useRouter } from 'next/router'

function LoadingView() {
  return <h1>Loading...</h1>
}

const ContentPage = () => {
  const router = useRouter()
  const {
    query: { type },
  } = router

  if (!type) {
    return <LoadingView />
  }

  const contentTypeDefinition = getContentTypeDefinition(type)

  const available = usePermission(`content.${type}.read`, '/', 'type')

  return (
    <Layout title="Content">
      {available && <div>
        <h1>List of {type}</h1>
        <ContentListView initialData={[]} type={contentTypeDefinition} />
        </div>}
      {!available && <LoadingView/> }
    </Layout>
  )
}

export default ContentPage
