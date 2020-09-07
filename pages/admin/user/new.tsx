import { usePermission } from '@lib/client/hooks'
import Layout from '@components/layout/admin/layout-admin'
import { UserForm } from '@components/user/admin-user/new'

const NewUserPage = () => {
  const { available } = usePermission([`user.admin`], '/')

  return (
    available && (
      <Layout title="New User">
        <h1>New User</h1>
        <UserForm />
      </Layout>
    )
  )
}

export default NewUserPage
