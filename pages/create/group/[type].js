import ContentForm from '@components/content/write-content/content-form/content-form'
import Layout from '@components/layout/normal/layout'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import { getGroupTypeDefinition } from '@lib/config'

const CreateContent = () => {
  const router = useRouter()
  const { type } = router.query

  const { available } = usePermission(
    type ? [`group.${type}.create`, `group.${type}.admin`] : null,
    '/'
  )

  const groupType = getGroupTypeDefinition(type)

  const [content, setContent] = useState(null)

  const onSave = (newItem) => {
    setContent(newItem)
    // router.push(`/edit/${newItem.type}/${newItem.slug}`)
  }

  useEffect(() => {
    if (groupType && !content) {
      const defaultState = {
        draft: false,
      }

      groupType.fields.forEach((field) => {
        // Default field value
        const fieldValue = field.value || field.defaultValue
        // Content value
        defaultState[field.name] = fieldValue
      })

      setContent(defaultState)
    }
  }, [groupType])

  return (
    <>
      <Layout title="New content">
        <div className="create-page">
          {available && (
            <>
              <h1>Create new {groupType ? groupType.title : 'content'}</h1>
              <ContentForm
                content={content}
                type={groupType}
                onSave={onSave}
              />
            </>
          )}
          {!available && <LoadingPage />}
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
