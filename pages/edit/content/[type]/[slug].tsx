import { useCallback, useMemo, useState } from 'react'

import ContentForm from '@components/content/write-content/content-form/content-form'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { contentPermission, cypheredFieldPermission } from '@lib/permissions'
import { findOneContent } from '@lib/api/entities/content'
import { getContentTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'
import Cypher from '@lib/api/api-helpers/cypher-fields'

function notFound(res) {
  res.writeHead(302, { Location: '/404' })
  res.end()
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { type, slug } = query

  const contentTypeDefinition = getContentTypeDefinition(type)

  // check if content is not in groups mapping
  if (!contentTypeDefinition || !slug || !type) {
    notFound(res)
    return
  }

  await connect()

  let content = null

  try {
    const searchOptions = {
      slug,
    }

    content = await findOneContent(type, searchOptions)

    if (!content) {
      notFound(res)
      return
    }
  } catch (e) {
    notFound(res)
    return
  }

  const currentUser = await getSession(req)

  // check if current user can update a content
  const canAccess = contentPermission(
    currentUser,
    contentTypeDefinition.slug,
    'update',
    content
  )

  if (!canAccess) {
    notFound(res)
    return
  }

  const [contentObject] = Cypher.getDecipheredData(
    {
      type: contentTypeDefinition.slug,
      entity: 'content',
      fields: contentTypeDefinition.fields,
    },
    [content],
    currentUser
  )

  return {
    props: {
      contentType: contentTypeDefinition,
      contentObject,
      currentUser,
    },
  }
}

const EditContent = ({ contentType, contentObject, currentUser }) => {
  const [content, setContent] = useState(contentObject)

  const onSave = useCallback(
    (newItem) => {
      setContent(newItem)
    },
    [setContent]
  )
  const permittedFields = useMemo(
    () =>
      contentType.fields.filter((field) => {
        if (!field.cypher || !field.cypher.enabled) {
          return true
        }

        return (
          cypheredFieldPermission(
            currentUser,
            'content',
            contentType.slug,
            field.name
          ) || contentObject?.author === currentUser?.id
        )
      }),
    [currentUser, contentType, contentObject]
  )

  return (
    <>
      <Layout title="Edit content">
        <div className="edit-page">
          <h1>Editing: {content ? content.title : null}</h1>
          <ContentForm
            permittedFields={permittedFields}
            type={contentType}
            onSave={onSave}
            content={content}
            currentUser={currentUser}
          />
        </div>
      </Layout>

      <style jsx>{`
        .edit-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default EditContent
