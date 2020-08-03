import GroupForm from '@components/groups/write/group-form/group-form'
import { groupPermission } from '@lib/permissions'
import Layout from '@components/layout/normal/layout'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import { GetServerSideProps } from 'next'
import { connect } from '@lib/api/db'
import { getGroupTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const groupTypeDefinition = getGroupTypeDefinition(query.type)

  // check if group is not in groups mapping
  if (!groupTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()

  const currentUser = await getSession(req)

  // check if current user can create a group
  const canAccess = groupPermission(
    currentUser,
    groupTypeDefinition.slug,
    'create'
  )

  if (!canAccess) {
    // User dot not have access for creation
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  return {
    props: {
      groupType: groupTypeDefinition,
    },
  }
}

const CreateGroup = () => {
  const router = useRouter()
  const { type } = router.query

  const { available } = usePermission(
    type ? [`group.${type}.create`, `group.${type}.admin`] : null,
    '/'
  )

  const groupType = getGroupTypeDefinition(type)

  const [group, setGroup] = useState(null)

  const onSave = (newItem) => {
    setGroup(newItem)
    // router.push(`/edit/${newItem.type}/${newItem.slug}`)
  }

  useEffect(() => {
    if (groupType && !group) {
      const defaultState = {
        draft: false,
      }

      groupType.fields.forEach((field) => {
        // Default field value
        const fieldValue = field.value || field.defaultValue
        // group value
        defaultState[field.name] = fieldValue
      })

      setGroup(defaultState)
    }
  }, [groupType])

  return (
    <>
      <Layout title="New group">
        <div className="create-page">
          {available && (
            <>
              <h1>Create new {groupType ? groupType.title : 'group'}</h1>
              <GroupForm group={group} type={groupType} onSave={onSave} />
            </>
          )}
          {!available && <LoadingPage />}
        </div>
      </Layout>
      <style jsx>{`
        .create-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default CreateGroup
