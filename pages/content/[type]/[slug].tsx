import { hasPermissionsForContent, hasPermissionsForGroupContent, loadUser } from '@lib/api/middlewares'

import ContentDetailView from '@components/content/read-content/content-detail-view/content-detail-view'
import Cypher from '@lib/api/api-helpers/cypher-fields'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/three-panels/layout'
import ToolBar from '@components/generic/toolbar/toolbar'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content'
import { getContentTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

// Get serversideProps is important for SEO, and only available at the pages level
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
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
    await runMiddleware(req, res, loadUser)
    
    if (item.groupId) {
      const group = await findOneContent(item.groupType, {
        id: item.groupId,
      })

      if (!group) {
        throw new Error('Not found')
      }

      await runMiddleware(
        req,
        res,
        hasPermissionsForGroupContent(item.groupType, query.type, group, item)
      )
    } else {
      await runMiddleware(req, res, hasPermissionsForContent(query.type, item))
    }
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
  const currentUser = await getSession(req)

  const data = await appendInteractions({
    data: [item],
    interactionsConfig: contentTypeDefinition.entityInteractions,
    entity: 'content',
    entityType: item.type,
    currentUser,
  })

  const [content] = Cypher.getDecipheredData(
    {
      type: contentTypeDefinition.slug,
      entity: 'content',
      fields: contentTypeDefinition.fields,
    },
    data,
    currentUser
  )

  return {
    props: {
      data: content,
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
    <Layout
      title={props.pageTitle}
      monetization={props.monetizationMeta}
      panelUser={<ToolBar />}
    >
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
