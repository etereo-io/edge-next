import {
  contentPermission,
  cypheredFieldPermission,
  groupContentPermission,
} from '@lib/permissions'
import { getContentTypeDefinition, getGroupTypeDefinition } from '@lib/config'
import { useMemo, useState } from 'react'

import ContentForm from '@components/content/write-content/content-form/content-form'
import { GetServerSideProps } from 'next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content'
import { getSession } from '@lib/api/auth/token'

// Get serversideProps is important for SEO, and only available at the pages level
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const contentTypeDefinition = getContentTypeDefinition(query.type)

  if (!contentTypeDefinition) {
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  await connect()

  // Group is null by default
  let group = null
  let groupTypeDefinition = null

  // Load group if is on the url
  if (query.groupId && query.groupType) {
    try {
      const searchOptions = {
        id: query.groupId,
        type: query.groupType,
      }

      group = await findOneContent(query.groupType, searchOptions)

      groupTypeDefinition = getGroupTypeDefinition(query.groupType)

      if (!group) {
        res.writeHead(302, { Location: '/404' })
        res.end()
        return
      }
    } catch (e) {
      // User can not access
      res.writeHead(302, { Location: '/404' })
      res.end()
      return
    }
  }
  const currentUser = await getSession(req)

  const canAccess = group
    ? groupContentPermission(
        currentUser,
        group.type,
        contentTypeDefinition.slug,
        'create',
        group
      )
    : contentPermission(currentUser, contentTypeDefinition.slug, 'create')

  if (!canAccess) {
    // User can not access
    res.writeHead(302, { Location: '/404' })
    res.end()
    return
  }

  return {
    props: {
      group: group,
      groupType: groupTypeDefinition,
      contentType: contentTypeDefinition,
      currentUser,
    },
  }
}

const CreateContent = ({ group, groupType, contentType, currentUser }) => {
  const defaultState = {
    draft: false,
  }

  const permittedFields = useMemo(
    () =>
      contentType.fields.filter((field) => {
        if (!field.cypher || !field.cypher.enabled) {
          return true
        }

        return cypheredFieldPermission(
          currentUser,
          'content',
          contentType.slug,
          field.name
        )
      }),
    [currentUser, contentType]
  )

  permittedFields.forEach((field) => {
    defaultState[field.name] = field.value || field.defaultValue
  })

  const [content, setContent] = useState(defaultState)

  const onSave = (newItem) => {
    setContent(newItem)
  }

  return (
    <>
      <Layout title="New content">
        <div className="create-page">
          <h1>Create new {contentType ? contentType.title : 'content'}</h1>
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
          >
            <ContentForm
              content={content}
              type={contentType}
              group={group}
              groupType={groupType}
              onSave={onSave}
              currentUser={currentUser}
              permittedFields={permittedFields}
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

export default CreateContent
