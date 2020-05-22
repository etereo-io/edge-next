import ContentDetailView from '@components/content/read-content/content-detail-view/content-detail-view'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/content/content'
import { getContentTypeDefinition } from '@lib/config'
import { hasPermissionsForContent } from '@lib/api/middlewares'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

// Get serversideProps is important for SEO, and only available at the pages level
export async function getServerSideProps({ req, res, query }) {
  const contentTypeDefinition = getContentTypeDefinition(query.type)

  if (!contentTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()

  const searchOptions =
    query.field && query.field === 'id'
      ? {
          id: query.slug,
        }
      : {
          slug: query.slug,
        }

  const item = await findOneContent(query.type, searchOptions)

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
      : `${contentTypeDefinition.title} detail`

  const hasWebMonetization =
    contentTypeDefinition.monetization && contentTypeDefinition.monetization.web
  const monetizationMeta = hasWebMonetization ? item.paymentPointer : null

  return {
    props: {
      data: item || null,
      type: query.type,
      slug: query.slug,
      canAccess: true,
      pageTitle: contentTitle,
      contentType: contentTypeDefinition,
      monetizationMeta: monetizationMeta || '',
    },
  }
}

const ContentPage = (props) => {
  return (
    <Layout title={props.pageTitle} monetization={props.monetizationMeta}>
      {props.canAccess && props.data && (
        <ContentDetailView
          type={props.contentType}
          content={props.data}
          showComments={true}
        />
      )}
    </Layout>
  )
}

export default ContentPage
