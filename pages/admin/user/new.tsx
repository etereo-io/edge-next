import Layout from '@components/layout/admin/layout-admin'
import { UserForm } from '@components/user/admin-user/new'
import { usePermission } from '@lib/client/hooks'

const NewUserPage = () => {
  const { available } = usePermission([`user.admin`], '/')

  return (
    <>
      <Layout title="New User" loading={!available}>
        <div className="user-administration">
          <h1>New User</h1>
          <UserForm />
        </div>
      </Layout>
      <style jsx>
        {`
          h1 {
            font-size: 23px;
            font-weight: 500;
            margin-bottom: 40px;
          }

          @media all and (max-width: 720px) {
            h1 {
              font-size: 18px;
            }
          }
          .user-administration {
            display: flex;
            flex-direction: column;
          }

          .create-button {
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
    </>
  )
}

export default NewUserPage
