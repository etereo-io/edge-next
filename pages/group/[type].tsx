import { hasPermissionsForGroup, loadUser } from '@lib/api/middlewares'

import Cypher from '@lib/api/api-helpers/cypher-fields'
import { GetServerSideProps } from 'next'
import GroupListView from '@components/groups/read/group-list-view/group-list-view'
import Layout from '@components/layout/three-panels/layout'
import LinkList from '@components/generic/link-list/link-list'
import ToolBar from '@components/generic/toolbar/toolbar'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import { connect } from '@lib/api/db'
import { findContent } from '@lib/api/entities/content'
import { getGroupTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/token'
import { groupPermission } from '@lib/permissions'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import { useGroupTypes } from '@lib/client/hooks'

// Get serversideProps is important for SEO, and only available at the pages level
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
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

  const filterOptions = {} as any

  const currentUser = await getSession(req)
  const isAdmin = currentUser && currentUser.roles.indexOf('ADMIN') !== -1

  // If the content type allows draft, filter them out on the public list
  if (groupTypeDefinition.publishing.draftMode && !isAdmin) {
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
        interactionsConfig: groupTypeDefinition.entityInteractions,
        entity: 'group',
        entityType: query.type as string,
        currentUser,
      })

      const decipheredData = Cypher.getDecipheredData(
        {
          type: groupTypeDefinition.slug,
          entity: 'group',
          fields: groupTypeDefinition.fields,
        },
        results,
        currentUser
      )

      const content = decipheredData.map((group) => {
        if (
          !groupPermission(
            currentUser,
            groupTypeDefinition.slug,
            'user.read',
            group
          )
        ) {
          const { members, pendingMembers, ...item } = group

          const permittedUsers = (members || []).filter(
            ({ id }) => id === currentUser?.id
          )

          const permittedPendingUsers = (pendingMembers || []).filter(
            ({ id }) => id === currentUser?.id
          )

          return {
            ...item,
            members: permittedUsers,
            pendingMembers: permittedPendingUsers,
          }
        }

        return group
      })

      return { ...data, results: content }
    }

    return data
  })

  return {
    props: {
      data: response,
      type: query.type,
      canAccess: true,
      query: query.tags ? `tags=${query.tags}` : '',
      groupType: groupTypeDefinition,
      sortOptions: {
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      },
    },
  }
}

const ContentPage = (props) => {
  const groupTypes = useGroupTypes(['read', 'admin'])

  const links = groupTypes.map((type) => {
    return {
      link: `/group/${type.slug}`,
      title: `See all ${type.title}`,
    }
  })

  return (
    <Layout title="Groups" panelUser={<ToolBar />}>
      <div>
        <div className="list-group-types">
          <LinkList links={links} />
        </div>

        <GroupListView
          initialData={props.data}
          type={props.groupType}
          infiniteScroll={true}
          query={props.query}
          defaultSortOptions={props.sortOptions}
        />
        <style jsx>
          {`
            .list-group-types {
              margin-bottom: var(--edge-gap-double);
            }
          `}
        </style>
      </div>
    </Layout>
  )
}

export default ContentPage
