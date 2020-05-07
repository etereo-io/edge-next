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

  // Load data
  const { data, error } = useSWR(
    type && slug ? API.content[type] + '/' + slug : null,
    fetch
  )

  const { available } = usePermission(
    [`content.${type}.update`, `content.${type}.admin`],
    '/404',
    null,
    (user) => {
      return data && data.author === user.id
    },
    data || error
  )

  const [content, setContent] = useState(null)

  const onSave = (newItem) => {
    setContent(newItem)
  }

  useEffect(() => {
    if (!content) {
      setContent(data)
    }
  }, [data])

  return (
    <>
      <Layout title="Edit content">
        {slug && type && (
          <div className="edit-page">
            <h1>Editing: {data ? data.title : null}</h1>

            {available && (
              <ContentForm type={contentType} onSave={onSave} content={data} />
            )}
          </div>
        )}
        {(!slug || !type) && <LoadingView />}
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
