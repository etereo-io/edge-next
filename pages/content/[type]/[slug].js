import ContentDetailView from '../../../components/content/read-content/content-detail-view/content-detail-view'
import Layout from '../../../components/layout/normal/layout'
import { connect } from '../../../lib/api/db'
import { findOneContent } from '../../../lib/api/content/content'
import { getContentTypeDefinition } from '../../../lib/config'
import { hasPermissionsForContent } from '../../../lib/api/middlewares'
import runMiddleware from '../../../lib/api/api-helpers/run-middleware'

// Get serversideProps is important for SEO, and only available at the pages level
export async function getServerSideProps({ req, res, query }) {
  const contentTypeDefinition = getContentTypeDefinition(query.type)

  if (!contentTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()

  const item = await findOneContent(query.type, {
    slug: query.slug,
  })

  if (!item) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  try {
    await runMiddleware(req, res, hasPermissionsForContent(query.type, item))
  } catch (e) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  const contentTitle =
    item && contentTypeDefinition.publishing.title
      ? item[contentTypeDefinition.publishing.title]
      : `${contentTypeDefinition.title.en} detail`

  return {
    props: {
      data: item || null,
      type: query.type,
      slug: query.slug,
      canAccess: true,
      pageTitle: contentTitle,
      user: req.user || {},
      contentType: contentTypeDefinition,
    },
  }
}

const ContentPage = (props) => {
  
  return (
    <Layout title={props.pageTitle}>
      {props.canAccess && props.data && (
        <ContentDetailView type={props.contentType} content={props.data} />
      )}
    </Layout>
  )
}

export default ContentPage
