import ContentForm from '../../components/content/write-content/content-form/content-form'
import Layout from '../../components/layout/normal/layout'
import { getContentTypeDefinition } from '../../lib/config'
import { usePermission } from '../../lib/hooks'
import { useRouter } from 'next/router'

const CreateContent = () => {
  const router = useRouter()
  const { type } = router.query
  const {available} = usePermission(type ? [`content.${type}.create`, `content.${type}.admin`]: null, '/')

  const contentType = getContentTypeDefinition(type)

  const onSaved = (newItem) => {
    // Router.go to /content/type/id
  }

  return (
    <>
    <Layout title="New content">
      <div className="create-page">
        <h1>Create new {contentType ? contentType.title.en : 'content'}</h1>

        {available && <ContentForm type={contentType} onSaved={onSaved} />}
      </div>
    </Layout>
  <style jsx>{`
    .create-page {
      margin-bottom: var(--empz-gap-double);
    }
    h1 {
      margin-bottom: var(--empz-gap);
    }
    
  `}</style>
    </>
  )
}

export default CreateContent
