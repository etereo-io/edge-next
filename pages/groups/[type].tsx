import { hasPermissionsForGroup, loadUser } from '@lib/api/middlewares'

import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/three-panels/layout'
import LinkList from '@components/generic/link-list/link-list'
import ToolBar from '@components/generic/toolbar/toolbar'
import { connect } from '@lib/api/db'
import { findContent } from '@lib/api/entities/content/content'
import { getGroupTypeDefinition } from '@lib/config'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { useGroupTypes } from '@lib/client/hooks'

// Get serversideProps is important for SEO, and only available at the pages level
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const groupTypeDefinition = getGroupTypeDefinition(query.type)

  if (!groupTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()
  try {
    await runMiddleware(req, res, loadUser)
    await runMiddleware(req, res, hasPermissionsForGroup(query.type))
  } catch (e) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  const filterOptions = {}

  // If the content type allows draft, filter them out on the public list
  if (groupTypeDefinition.publishing.draftMode) {
    filterOptions.draft = false
  }

  if (query.tags) {
    filterOptions['tags.slug'] = query.tags
  }

  const response = await findContent(
    query.type,
    filterOptions,
    { sortBy: 'createdAt', sortOrder: 'DESC' },
    { limit: 10 }
  )

  return {
    props: {
      data: response,
      type: query.type,
      canAccess: true,
      query: `&sortBy=createdAt&sortOrder=DESC${
        query.tags ? `&tags=${query.tags}` : ''
      }`,
      groupType: groupTypeDefinition,
    },
  }
}

const ContentPage = (props) => {
  const groupTypes = useGroupTypes(['read', 'admin'])

  const links = groupTypes.map((type) => {
    return {
      link: `/groups/${type.slug}`,
      title: `See all ${type.title}`,
    }
  })
  
  return (
    <Layout title="Groups" panelUser={<ToolBar />}>
      <div>
   
        <div className="list-group-types">
          <LinkList links={links} />
        </div>


        <ContentListView
          initialData={props.data}
          type={props.groupType}
          infiniteScroll={true}
          query={props.query}
        />
        <style jsx>{`
          .list-group-types {
            margin-bottom: var(--edge-gap-double);
          }
          `
        }
        </style>
      </div>
    </Layout>
  )
}

export default ContentPage
