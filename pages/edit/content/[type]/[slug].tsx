import { contentPermission } from '@lib/permissions'
import { getContentTypeDefinition } from '@lib/config'

import API from '@lib/api/api-endpoints'
import ContentForm from '@components/content/write-content/content-form/content-form'
import Layout from '@components/layout/normal/layout'
import fetch from '@lib/fetcher'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import { useCallback, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { findOneContent } from '@lib/api/entities/content/content'
import { connect } from '@lib/api/db'
import { getSession } from '@lib/api/auth/iron'

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

  return {
    props: {
      contentType: contentTypeDefinition,
      contentObject: content,
    },
  }
}

const EditContent = ({ contentType, contentObject }) => {
  const [content, setContent] = useState(contentObject)

  const onSave = useCallback(
    (newItem) => {
      setContent(newItem)
    },
    [setContent]
  )

  return (
    <>
      <Layout title="Edit content">
        <div className="edit-page">
          <h1>Editing: {content ? content.title : null}</h1>
          <ContentForm type={contentType} onSave={onSave} content={content} />
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
