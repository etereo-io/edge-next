import API from '../lib/api/api-endpoints'
import ContentListView from '../components/content/read-content/content-list-view/content-list-view'
import Layout from '../components/layout/normal/layout'
import ListContentTypes from '../components/content/read-content/list-content-types/list-content-types'
import fetch from '../lib/fetcher'
import { getContentTypeDefinition } from '../lib/config'
import useSWR from 'swr'

// Get serversideProps is important for SEO, and only available at the pages level
/*export async function getServerSideProps({ req }) {
  // TODO: Extract the API url from an environment variable
  const baseUrl = 'http://localhost:3000'
  const response = await fetch(baseUrl + API.content.post)

  return {
    props: {
      data: response,
    },
  }
}*/

const Home = (props) => {

  const initialData = props.data

  // Fetch Posts
  const { data } = useSWR(API.content.post, fetch, { initialData })

  // Get the definition for the post content type
  const contentTypeDefinition = getContentTypeDefinition('post')

  return (
    <Layout title="Home page">
      <ListContentTypes />

      <ContentListView infiniteScroll={true} initialData={[]} type={contentTypeDefinition} />

      
    </Layout>
  )
}

export default Home
