import Layout from '@components/layout/admin/layout-admin'
import { UserForm } from '@components/user/admin-user/new'
import { usePermission } from '@lib/client/hooks'

const NewUserPage = () => {
  const { available } = usePermission([`user.admin`], '/')

  return (
 
      <Layout title="New User" loading={!available}>
        <h1>New User</h1>
        <UserForm />
      </Layout>
    
  )
}

export default NewUserPage
