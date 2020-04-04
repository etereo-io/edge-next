import { usePermission } from '../../lib/hooks'

import {getContentTypeDefinition} from '../../lib/config'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import ContentForm from '../../components/content/write-content/content-form/content-form'

const CreateContent = () => {
  const router = useRouter()
  const { slug } = router.query
  const locked = usePermission(`content.${slug}.write`, '/', 'slug')

  const type = getContentTypeDefinition(slug)

  const onSaved = (newItem) => {
    // Router.go to /content/slug/id
  }

  return (
    !locked && (
      <Layout title="New content">
        <h1>Create new {type.title.en}</h1>

        <ContentForm type={type} onSaved={onSaved} />
      </Layout>
    )
  )
}

export default CreateContent
