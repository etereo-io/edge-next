import GroupForm from '@components/groups/write/group-form/group-form'
import Layout from '@components/layout/normal/layout'
import { usePermission } from '@lib/client/hooks'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import { getGroupTypeDefinition } from '@lib/config'

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
              <GroupForm
                group={group}
                type={groupType}
                onSave={onSave}
              />
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
