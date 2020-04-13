import { usePermission } from '../../lib/hooks'

import { getContentTypeDefinition } from '../../lib/config'
import Layout from '../../components/layout/normal/layout'
import { useRouter } from 'next/router'
import ContentForm from '../../components/content/write-content/content-form/content-form'
import './create.scss'

const CreateContent = () => {
  const router = useRouter()
  const { type } = router.query
  const available = usePermission(`content.${type}.write`, '/', 'type')

  const contentType = getContentTypeDefinition(type)

  const onSaved = (newItem) => {
    // Router.go to /content/type/id
  }

  return (
    available && (
      <Layout title="New content" className="create-page">
        <h1>Create new {contentType.title.en}</h1>

        <ContentForm type={contentType} onSaved={onSaved} />
      </Layout>
    )
  )
}

export default CreateContent
