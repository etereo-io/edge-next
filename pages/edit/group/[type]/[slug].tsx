import { useCallback, useState } from 'react'

import { GetServerSideProps } from 'next'
import GroupForm from '@components/groups/write/group-form/group-form'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content'
import { getGroupTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'
import { groupPermission } from '@lib/permissions'

function notFound(res) {
  res.writeHead(302, { Location: '/404' })
  res.end()
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { type, slug } = query

  const groupTypeDefinition = getGroupTypeDefinition(type)

  // check if group is not in groups mapping
  if (!groupTypeDefinition || !slug || !type) {
    notFound(res)
    return
  }

  await connect()

  let group = null

  try {
    const searchOptions = {
      slug,
    }

    group = await findOneContent(type, searchOptions)

    if (!group) {
      notFound(res)
      return
    }
  } catch (e) {
    notFound(res)
    return
  }

  const currentUser = await getSession(req)

  // check if current user can update a group
  const canAccess = groupPermission(currentUser, type, 'update', group)

  if (!canAccess) {
    notFound(res)
    return
  }

  return {
    props: {
      groupType: groupTypeDefinition,
      groupObject: group,
    },
  }
}

const EditGroup = ({ groupType, groupObject }) => {
  const [group, setGroup] = useState(groupObject)

  const onSave = useCallback(
    (newItem) => {
      setGroup(newItem)
    },
    [setGroup]
  )

  return (
    <>
      <Layout title="Edit group">
        <div className="edit-page">
          <h1>Editing: {group ? group.title : null}</h1>
          <GroupForm type={groupType} onSave={onSave} group={group} />
        </div>
      </Layout>

      <style jsx>{`
        .edit-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default EditGroup
