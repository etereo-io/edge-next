import { usePermission } from '../../lib/hooks'

import { getContentTypeDefinition } from '../../lib/config'
import Layout from '../../components/layout/normal/layout'
import { useRouter } from 'next/router'
import ContentForm from '../../components/content/write-content/content-form/content-form'
import './create.scss'

const CreateContent = () => {
  const router = useRouter()
  const { slug } = router.query
  const available = usePermission(`content.${slug}.write`, '/', 'slug')

  const type = getContentTypeDefinition(slug)

  const onSaved = (newItem) => {
    // Router.go to /content/slug/id
  }

  return (
    available && (
      <Layout title="New content" className="create-page">
        <h1>Create new {type.title.en}</h1>

        <ContentForm type={type} onSaved={onSaved} />
      </Layout>
    )
  )
}

export default CreateContent
