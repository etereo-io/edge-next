import { useRouter } from 'next/router'
import { useCallback } from 'react'

import Layout from '@components/layout/admin/layout-admin'
import UserTable from '@components/user/admin-user/user-table/user-table'
import { usePermission } from '@lib/client/hooks'
import Button from '@components/generic/button/button'

const AdminPage = () => {
  const { available } = usePermission([`user.admin`], '/')
  const router = useRouter()

  const createUser = useCallback(() => {
    router.push('/admin/user/new')
  }, [router])

  return (
    available && (
      <Layout title="User administration">
        <Button onClick={createUser}>Create user</Button>
        <h1>User adminsitration</h1>
        <UserTable />
      </Layout>
    )
  )
}

export default AdminPage
