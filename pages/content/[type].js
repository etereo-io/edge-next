import ContentListView from '../../components/content/read-content/content-list-view/content-list-view'
import Layout from '../../components/layout/normal/layout'
import ListContentTypes from '../../components/content/read-content/list-content-types/list-content-types'
import { connect } from '../../lib/api/db'
import { findContent } from '../../lib/api/content/content'
import { getContentTypeDefinition } from '../../lib/config'
import { hasPermissionsForContent } from '../../lib/api/middlewares'
import runMiddleware from '../../lib/api/api-helpers/run-middleware'

// Get serversideProps is important for SEO, and only available at the pages level
export async function getServerSideProps({ req, res, query }) {
  const contentTypeDefinition = getContentTypeDefinition(query.type)
  
  if (!contentTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()
  try {
    await runMiddleware(req, res, hasPermissionsForContent(query.type))
  } catch (e) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  const filterOptions = {}
  contentTypeDefinition.publishing.draftMode = filterOptions.draft = false

  if (query.tags) {
    filterOptions['tags.slug'] = query.tags
  }
  
  const response = await findContent(query.type, filterOptions, {  sortBy: 'createdAt', sortOrder: 'DESC'}, { limit: 10})

  return {
    props: {
      data: response,
      type: query.type,
      canAccess: true,
      query: `&sortBy=createdAt&sortOrder=DESC${query.tags ? `&tags=${query.tags}` : ''}` ,
      contentType: contentTypeDefinition
    },
  }
}

const ContentPage = (props) => {

  return (
    <Layout title="Content">
      <div>
        <ListContentTypes />

        <ContentListView
          initialData={props.data}
          type={props.contentType}
          infiniteScroll={true}
          query={props.query}
        />
      </div>
    </Layout>
  )
}

export default ContentPage
