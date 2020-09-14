import { usePermission, useUser } from '@lib/client/hooks'

import EmailTable from '@components/email/email-table'
import Layout from '@components/layout/admin/layout-admin'

const EmailsPage = () => {
  const { user } = useUser({ redirectTo: '/' })

  const { available } = usePermission([`admin.email`], '/')

  return (
    <>
      <Layout title="Emails" loading={!available || !user}>
        <div className="user-administration">
          <h1>Emails</h1>
          
          <EmailTable user={user} />
        </div>
      </Layout>

      <style jsx>{`
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

        
      `}</style>
    </>
  )
}

export default EmailsPage
