import Button from '@components/generic/button/button'
import Layout from '@components/layout/admin/layout-admin'
import UserTable from '@components/user/admin-user/user-table/user-table'
import { useCallback } from 'react'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'

const AdminPage = () => {
  const { available } = usePermission([`user.admin`], '/')
  const router = useRouter()

  const createUser = useCallback(() => {
    router.push('/admin/user/new')
  }, [router])

  return (

    <Layout title="User administration" loading={!available}>
      <div className="user-administration">
        <header className="user-administration-header">
          <h1>User adminsitration</h1>
          <div className="create-button">
            <Button onClick={createUser}>
              Create user
            </Button>
          </div>
        </header>

        <UserTable />
      </div>
      <style jsx>
        {`

          .user-administration-header {
            display: flex;
            justify-content: space-between;
          }

          h1 {
            font-size: 23px;
            font-weight: 500;
          }

          @media all and (max-width: 720px) {
            h1 {
              font-size: 18px;
            }
          }
          .user-administration {
            display: flex;
            flex-direction: column
          }

          .create-button {
            display: flex;
            justify-content: flex-end;
          }

          form{
            margin: 40px 0 24px;
          }
          `}
      </style>
    </Layout>

  )
}

export default AdminPage
