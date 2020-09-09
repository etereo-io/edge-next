import { useRouter } from 'next/router'
import { memo } from 'react'

import GroupsTable from '@components/groups/admin-groups/groups-table/groups-table'
import Layout from '@components/layout/admin/layout-admin'
import { getGroupTypeDefinition } from '@lib/config'
import { usePermission } from '@lib/client/hooks'

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
        <h1>Group administration for {slug}</h1>

        <GroupsTable type={groupType} />
      </Layout>
    )}
    <style jsx>{`
      h1{
        font-size: 23px;
        font-weight: 500;
      }
    `}</style>
  </>
  )
}

export default memo(AdminPage)
