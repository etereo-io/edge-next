import ContentForm from '../../components/content/write-content/content-form/content-form'
import Layout from '../../components/layout/normal/layout'
import { getContentTypeDefinition } from '../../lib/config'
import styles from './[type].module.scss'
import { usePermission } from '../../lib/hooks'
import { useRouter } from 'next/router'

const CreateContent = () => {
  const router = useRouter()
  const { type } = router.query
  const available = usePermission(`content.${type}.write`, '/', 'type')

  const contentType = getContentTypeDefinition(type)

  const onSaved = (newItem) => {
    // Router.go to /content/type/id
  }

  return (
     
      <Layout title="New content" className={styles['create-page']}>
        <h1>Create new {contentType ? contentType.title.en: 'content'}</h1>

        {available && <ContentForm type={contentType} onSaved={onSaved} />}
      </Layout>
    
  )
}

export default CreateContent
