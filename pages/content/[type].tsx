import { hasPermissionsForContent, loadUser } from '@lib/api/middlewares'

import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/three-panels/layout'
import ListContentTypes from '@components/content/read-content/list-content-types/list-content-types'
import ToolBar from '@components/generic/toolbar/toolbar'
import { connect } from '@lib/api/db'
import { findContent } from '@lib/api/entities/content'
import { getContentTypeDefinition } from '@lib/config'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { getSession } from '@lib/api/auth/iron'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import { getDecipheredData } from '@lib/api/api-helpers/cypher-fields'


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
  try {
    await runMiddleware(req, res, loadUser)
    await runMiddleware(req, res, hasPermissionsForContent(query.type))
  } catch (e) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  const filterOptions = {} as any

  const currentUser = await getSession(req)
  const isAdmin = currentUser && currentUser.roles.indexOf('ADMIN') !== -1

  // If the content type allows draft, filter them out on the public list
  if (contentTypeDefinition.publishing.draftMode && !isAdmin) {
    filterOptions.draft = false
  }

  if (query.tags) {
    filterOptions['tags.slug'] = query.tags
  }

  const response = await findContent(query.type, filterOptions, {
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: 10,
  }).then(async (data) => {
    if (data.total) {
      const results = await appendInteractions({
        data: data.results,
        interactionsConfig: contentTypeDefinition.entityInteractions,
        entity: 'content',
        entityType: query.type as string,
        currentUser,
      })

      const decipheredData = getDecipheredData(
        {
          type: contentTypeDefinition.slug,
          entity: 'content',
          fields: contentTypeDefinition.fields,
        },
        results,
        currentUser
      )

      return { ...data, results: decipheredData }
    }

    return data
  })

  return {
    props: {
      data: response,
      type: query.type,
      canAccess: true,
      query: query.tags ? `tags=${query.tags}` : '',
      contentType: contentTypeDefinition,
      sortOptions: {
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      },
    },
  }
}

const ContentPage = (props) => {
  return (
    <Layout title="Content" panelUser={<ToolBar />}>
      <div>
        <ListContentTypes />

        <ContentListView
          initialData={props.data}
          type={props.contentType}
          infiniteScroll={true}
          query={props.query}
          defaultSortOptions={props.sortOptions}
        />
      </div>
    </Layout>
  )
}

export default ContentPage
