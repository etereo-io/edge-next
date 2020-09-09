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
        <div className="user-administration">
          <h1>User adminsitration</h1>
          <div className="create-button">
            <Button onClick={createUser}>
              Create user
            </Button>
          </div>

          <UserTable />
        </div>
        <style jsx>
          {`

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
          `}
        </style>
      </Layout>
    )
  )
}

export default AdminPage
