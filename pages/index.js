import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import ContentSummaryView from '../components/content/read-content/content-summary-view/content-summary-view'
import { getContentTypeDefinition } from '../lib/config'
import useSWR from 'swr'
import fetch from '../lib/fetcher'
import API from '../lib/api/api-endpoints'

// export async function getServerSideProps() {
//   const data = await fetcher(API.content.post)
//   return { props: { data } }
// }

const Home = (props) => {
  const { user } = useUser()
  const initialData = props.data

  // Fetch Posts
  const { data } = useSWR(API.content.post, fetch, { initialData })

  // Get the definition for the post content type
  const contentTypeDefinition = getContentTypeDefinition('post')

  return (
    <Layout title="Home page">
      <h1>Demo Site</h1>

      { (data ? data.data : [] ).map(item => {
        return (
          <ContentSummaryView content={item} type={contentTypeDefinition } />
        )
      })}
      
    </Layout>
  )
}

export default Home
