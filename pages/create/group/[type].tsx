import GroupForm from '@components/groups/write/group-form/group-form'
import { cypheredFieldPermission, groupPermission } from '@lib/permissions'
import Layout from '@components/layout/normal/layout'
import { useState, useMemo, useCallback } from 'react'
import { GetServerSideProps } from 'next'
import { connect } from '@lib/api/db'
import { getGroupTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

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
      currentUser,
    },
  }
}

const CreateGroup = ({ groupType, currentUser }) => {
  const permittedFields = useMemo(
    () =>
      groupType.fields.filter((field) => {
        if (!field.cypher || !field.cypher.enabled) {
          return true
        }

        return cypheredFieldPermission(
          currentUser,
          'group',
          groupType.slug,
          field.name
        )
      }),
    [currentUser, groupType]
  )

  const defaultState = useMemo(() => {
    const state = { draft: false }

    permittedFields.forEach(({ name, value, defaultValue }) => {
      state[name] = value || defaultValue
    })

    return state
  }, [groupType, permittedFields])

  const [group, setGroup] = useState(defaultState)

  const onSave = useCallback(
    (newItem) => {
      setGroup(newItem)
    },
    [setGroup]
  )

  return (
    <>
      <Layout title="New group">
        <div className="create-page">
          <h1>Create new {groupType ? groupType.title : 'group'}</h1>
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          >
            <GroupForm
              permittedFields={permittedFields}
              group={group}
              type={groupType}
              onSave={onSave}
            />
          </GoogleReCaptchaProvider>
        </div>
      </Layout>
      <style jsx>{`
        .create-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          font-size: 23px;
          font-weight: 500;
        }
        @media all and (max-width: 720px) {
          h1 {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  )
}

export default CreateGroup
