import React, { useState, useCallback } from 'react'
import { GetServerSideProps } from 'next'

import { hasPermissionsForGroup, loadUser } from '@lib/api/middlewares'
import GroupDetailView from '@components/groups/read/group-detail-view/group-detail-view'
import Layout from '@components/layout/three-panels/layout'
import ToolBar from '@components/generic/toolbar/toolbar'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content/content'
import { getGroupTypeDefinition } from '@lib/config'
import runMiddleware from '@lib/api/api-helpers/run-middleware'
import GroupContext from '@components/groups/context/group-context'
import { appendInteractions } from '@lib/api/api-helpers/interactions'
import { getSession } from '@lib/api/auth/iron'

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

  return {
    props: {
      data: data[0],
      pageTitle: contentTitle,
      groupType: groupTypeDefinition,
    },
  }
}

const ContentPage = ({ data, groupType, pageTitle }) => {
  const [group, setGroup] = useState(data)

  const onSubmitEvent = useCallback((data) => {
    setGroup(data)
  }, [setGroup])

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
