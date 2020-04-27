import ContentListView from '../components/content/read-content/content-list-view/content-list-view'
import Layout from '../components/layout/normal/layout'
import ListContentTypes from '../components/content/read-content/list-content-types/list-content-types'
import { connect } from '../lib/api/db'
import { findContent } from '../lib/api/content/content'
import { getContentTypeDefinition } from '../lib/config'

// Get serversideProps is important for SEO, and only available at the pages level
export async function getServerSideProps({ req }) { 
  await connect()
  const response = await findContent('post')
  
  return {
    props: {
      data: response,
    },
  }
}

const Home = (props) => {
  
  const initialData = props.data

  // Get the definition for the post content type
  const contentTypeDefinition = getContentTypeDefinition('post')

  return (
    <Layout title="Home page" >
      <ListContentTypes />

      <ContentListView infiniteScroll={true} initialData={initialData} type={contentTypeDefinition} />
    </Layout>
  )
}

export default Home
