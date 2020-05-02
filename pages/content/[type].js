import ContentListView from '../../components/content/read-content/content-list-view/content-list-view'
import Layout from '../../components/layout/normal/layout'
import ListContentTypes from '../../components/content/read-content/list-content-types/list-content-types'
import { connect } from '../../lib/api/db'
import { findContent } from '../../lib/api/content/content'
import { getContentTypeDefinition } from '../../lib/config'
import { hasPermissionsForContent } from '../../lib/api/middlewares'
import runMiddleware from '../../lib/api/api-helpers/run-middleware'
import { usePermission } from '../../lib/hooks'

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
    return {
      props: {
        data: null,
        type: query.type,
        canAccess: false,
      },
    }
  }

  const response = await findContent(query.type)

  return {
    props: {
      data: response,
      type: query.type,
      canAccess: true,
      user: req.user || {},
    },
  }
}

const ContentPage = (props) => {
  const contentTypeDefinition = getContentTypeDefinition(props.type)

  // Will redirect the user out if permission is not granted.
  // For public sites this should be removed
  usePermission([`content.${props.type}.read`, `content.${props.type}.admin`], '/', null , props.user)

  return (
    <Layout title="Content">
      <div>
        <ListContentTypes />

        <ContentListView
          initialData={props.data}
          type={contentTypeDefinition}
          infiniteScroll={true}
        />
      </div>
    </Layout>
  )
}

export default ContentPage
