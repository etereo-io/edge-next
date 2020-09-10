import GroupsTable from '@components/groups/admin-groups/groups-table/groups-table'
import Layout from '@components/layout/admin/layout-admin'
import { getGroupTypeDefinition } from '@lib/config'
import { memo } from 'react'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'

function AdminPage() {
  const router = useRouter()
  const { slug } = router.query

  const { available } = usePermission(
    slug ? [`group.${slug}.admin`] : null,
    '/'
  )

  const groupType = getGroupTypeDefinition(slug)

  return (
    <>
    {available && (
      <Layout title="Content">
        <h1>{groupType.title} administration</h1>

        <GroupsTable type={groupType} />
      </Layout>
    )}
    <style jsx>{`
      h1{
        font-size: 23px;
        font-weight: 500;
      }

      @media all and (max-width: 720px) {
          h1 {
            font-size: 18px;
          }
        }
    `}</style>
  </>
  )
}

export default memo(AdminPage)
