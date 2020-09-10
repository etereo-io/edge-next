import { usePermission, useUser } from '@lib/client/hooks'

import Button from '@components/generic/button/button'
import EmailTable from '@components/email/email-table'
import Layout from '@components/layout/admin/layout-admin'
import { useState } from 'react'

const EmailsPage = () => {
  const { user } = useUser({ redirectTo: '/' })

  const { available } = usePermission([`admin.email`], '/')

  const [ showEmailForm, setShowEmailForm] = useState(false)

  return (
    <>
      <Layout title="Emails" loading={!available || !user}>
        <div className="user-administration">
          <h1>Emails</h1>
          <div className="create-button">
            <Button onClick={() => setShowEmailForm(true)}>
              Create Email
              </Button>
          </div>

          <EmailTable />
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

        .create-button {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </>
  )
}

export default EmailsPage
