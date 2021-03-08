import React, { useCallback, useEffect, useState } from 'react'
import { hasPermissionsForGroup, loadUser } from '@lib/api/middlewares'

import Cypher from '@lib/api/api-helpers/cypher-fields'
import { GetServerSideProps } from 'next'
import GroupContext from '@components/groups/context/group-context'
import GroupDetailView from '@components/groups/read/group-detail-view/group-detail-view'
import Layout from '@components/layout/three-panels/layout'
import ToolBar from '@components/generic/toolbar/toolbar'
import { appendInteractions } from '@lib/api/entities/interactions/interactions.utils'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content'
import { getGroupTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/token'
import { groupUserPermission } from '@lib/permissions'
import runMiddleware from '@lib/api/api-helpers/run-middleware'

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

  const searchOptions =
    query.field && query.field === 'id'
      ? {
          id: query.slug,
        }
      : {
          'seo.slug': query.slug,
        }

  const item = await findOneContent(query.type, searchOptions)

  if (!item) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  try {
    await runMiddleware(req, res, loadUser)
    await runMiddleware(req, res, hasPermissionsForGroup(query.type, item))
  } catch (e) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  const contentTitle =
    item && groupTypeDefinition.publishing.title
      ? item[groupTypeDefinition.publishing.title]
      : `${groupTypeDefinition.title} detail`

  const currentUser = await getSession(req)

  const data = await appendInteractions({
    data: [item],
    interactionsConfig: groupTypeDefinition.entityInteractions,
    entity: 'group',
    entityType: item.type,
    currentUser,
  })

  const decipheredData = Cypher.getDecipheredData(
    {
      type: groupTypeDefinition.slug,
      entity: 'group',
      fields: groupTypeDefinition.fields,
    },
    data,
    currentUser
  )

  let [group] = decipheredData

  if (
    !groupUserPermission(currentUser, groupTypeDefinition.slug, 'read', group)
  ) {
    const { members, pendingMembers, ...item } = group

    const permittedUsers = (members || []).filter(
      ({ id }) => id === currentUser?.id
    )

    const permittedPendingUsers = (pendingMembers || []).filter(
      ({ id }) => id === currentUser?.id
    )

    group = {
      ...item,
      members: permittedUsers,
      pendingMembers: permittedPendingUsers,
    }
  }

  return {
    props: {
      data: group,
      pageTitle: contentTitle,
      groupType: groupTypeDefinition,
    },
  }
}

const ContentPage = ({ data, groupType, pageTitle }) => {
  const [group, setGroup] = useState(data)
  // Context to store the group object and refresh it after editing members. 
  // Refactor this
  const onSubmitEvent = useCallback(
    (data) => {
      setGroup(data)
    },
    [setGroup]
  )

  useEffect(() => {
    onSubmitEvent(data)
  }, [data])

  return (
    <Layout title={pageTitle} panelUser={<ToolBar />}>
      <GroupContext.Provider value={{ onSubmitEvent }}>
        {group && (
          <GroupDetailView type={groupType} group={group} showActions={true} />
        )}
      </GroupContext.Provider>
    </Layout>
  )
}

export default ContentPage
