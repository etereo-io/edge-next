import { useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import GroupForm from '@components/groups/write/group-form/group-form'
import Layout from '@components/layout/normal/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import fetch from '@lib/fetcher'
import { getGroupTypeDefinition } from '@lib/config'
import { groupPermission } from '@lib/permissions'
import { useRouter } from 'next/router'
import { useUser } from '@lib/client/hooks'

const EditGroup = () => {
  const router = useRouter()
  const {
    query: { slug, type },
  } = router

  const groupType = getGroupTypeDefinition(type)
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load data
  function loadData() {
    fetch(API.groups[type] + '/' + slug)
      .then((data) => {
        setGroup(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (slug && type && !group && !error) {
      loadData()
    }
  }, [slug, type, group, error])

  // Check permissions to edit
  const currentUser = useUser()
  const canAccess = groupPermission(currentUser.user, type, 'update', group)

  const onSave = (newItem) => {
    setGroup(newItem)
  }

  useEffect(() => {
    if (!loading && currentUser.finished) {
      if (error || !canAccess) {
        console.log(error, canAccess, groupType, currentUser.user)
        // Redirect to 404 if the user is not found
        router.push('/404')
      }
    }
  }, [loading, canAccess, error, currentUser])

  if (!currentUser.finished || loading || error || !canAccess) {
    return (
      <Layout title="Edit group">
        <LoadingPage />
      </Layout>
    )
  }

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
