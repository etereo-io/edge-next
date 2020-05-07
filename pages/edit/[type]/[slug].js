import { usePermission } from '../../../lib/hooks'

import API from '../../../lib/api/api-endpoints'
import ContentForm from '../../../components/content/write-content/content-form/content-form'
import Layout from '../../../components/layout/normal/layout'
import fetch from '../../../lib/fetcher'
import { getContentTypeDefinition } from '../../../lib/config'

import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

function LoadingView() {
  return <h1>Loading...</h1>
}

const EditContent = () => {
  const router = useRouter()
  const {
    query: { slug, type },
  } = router

  const contentType = getContentTypeDefinition(type)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load data
  function loadData() {
    fetch(API.content[type] + '/' + slug)
      .then(data => {
        setContent(data)
        setLoading(false)
      })
      .catch(err => {
        setError(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (slug && type && (!content && !error)) {
      loadData()
    }
  }, [slug, type, content, error])

  const { available } = usePermission(
    [`content.${type}.update`, `content.${type}.admin`],
    '/404',
    null,
    (user) => {
      return content && content.author === user.id
    },
    content || error
  )

  const onSave = (newItem) => {
    setContent(newItem)
  }

  return (
    <>
      <Layout title="Edit content">
        {!loading && !error && (
          <div className="edit-page">
            <h1>Editing: {content ? content.title : null}</h1>

            {available && (
              <ContentForm type={contentType} onSave={onSave} content={content} />
            )}
          </div>
        )}
        {(loading || error) && <LoadingView />}
      </Layout>

      <style jsx>{`
        .edit-page {
          margin-bottom: var(--empz-gap-double);
        }
        h1 {
          margin-bottom: var(--empz-gap);
        }
      `}</style>
    </>
  )
}

export default EditContent
