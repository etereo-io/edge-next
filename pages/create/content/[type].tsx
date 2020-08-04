import { contentPermission, groupContentPermission } from '@lib/permissions'
import { getContentTypeDefinition, getGroupTypeDefinition } from '@lib/config'

import ContentForm from '@components/content/write-content/content-form/content-form'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content/content'
import { getSession } from '@lib/api/auth/iron'
import { useState } from 'react'

// Get serversideProps is important for SEO, and only available at the pages level
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const contentTypeDefinition = getContentTypeDefinition(query.type)

  if (!contentTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()

  // Group is null by default 
  let group = null
  let groupTypeDefinition = null

  // Load group if is on the url
  if (query.groupId && query.groupType) {
    try {
      const searchOptions = {
        id: query.groupId,
        type: query.groupType
      }
  
      group = await findOneContent(query.groupType, searchOptions)

      groupTypeDefinition = getGroupTypeDefinition(query.groupType)

      if (!group) {
        res.writeHead(302, { Location: '/404' })
        res.end()
        return
      }


    }  catch (e) {
      // User can not access
      res.writeHead(302, { Location: '/404' })
      res.end()
      return
    }
  }
  const currentUser = await getSession(req)

  const canAccess = group ? groupContentPermission(currentUser,
    group.type,
    contentTypeDefinition.slug,
    'create',
    group
  ):  contentPermission(currentUser, contentTypeDefinition.slug, 'create')

  if (!canAccess) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }


  return {
    props: {
      group: group,
      groupType: groupTypeDefinition,
      contentType: contentTypeDefinition
    },
  }
}

const CreateContent = ({
  group,
  groupType,
  contentType
}) => {

  const defaultState = {
    draft: false,
  }

  contentType.fields.forEach((field) => {
    // Default field value
    const fieldValue = field.value || field.defaultValue
    // Content value
    defaultState[field.name] = fieldValue
  })

  const [content, setContent] = useState(defaultState)

  const onSave = (newItem) => {
    setContent(newItem)
  }


  return (
    <>
      <Layout title="New content">
        <div className="create-page">
          <h1>Create new {contentType ? contentType.title : 'content'}</h1>
          <ContentForm
            content={content}
            type={contentType}
            group={group}
            groupType={groupType}
            onSave={onSave}
          />
        </div>
      </Layout>
      <style jsx>{`
        .create-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default CreateContent
