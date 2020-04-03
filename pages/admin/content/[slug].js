import { useUser, usePermission} from '../../../lib/hooks'
import { hasPermission } from '../../../lib/permissions'
import config from '../../../lib/config'
import Layout from '../../../components/layout-admin'
import { useRouter } from 'next/router'


import Link from 'next/link'


const AdminPage = () => {
  const {user} = useUser()
  const router = useRouter()
  const { slug } = router.query
  const locked = usePermission(`content.${slug}.admin`, '/', 'slug')

  
  
  return !locked && (
    <Layout>
      <h1>Content administration {slug}</h1>

     
    </Layout>
  )
}

export default AdminPage
