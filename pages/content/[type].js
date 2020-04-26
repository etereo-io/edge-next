import ContentListView from '../../components/content/read-content/content-list-view/content-list-view'
import Layout from '../../components/layout/normal/layout'
import { findContent } from '../../lib/api/content/content'
import { getContentTypeDefinition } from '../../lib/config'
import { usePermission } from '../../lib/hooks'

// Get serversideProps is important for SEO, and only available at the pages level
export async function getServerSideProps({ req, query }) { 
  
  const response = await findContent(query.type)
  
  return {
    props: {
      data: response,
      type: query.type
    },
  }
}


const ContentPage = (props) => {
  
  const contentTypeDefinition = getContentTypeDefinition(props.type)

  // Will redirect the user out if permission is not granted. 
  // For public sites this should be removed
  usePermission(`content.${props.type}.read`, '/', 'type')

  return (
    <Layout title="Content">
      <div>
        <ContentListView initialData={props.data} type={contentTypeDefinition} />
      </div>
    </Layout>
  )
}

export default ContentPage
