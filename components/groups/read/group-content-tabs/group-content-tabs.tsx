import React, { memo, useMemo } from 'react'

import { getContentTypeDefinition, getGroupTypeDefinition } from '@lib/config'
import { groupContentPermission } from '@lib/permissions'
import { GroupEntityType } from '@lib/types/entities/group'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import { useUser } from '@lib/client/hooks'
import { Tabs, useTab } from '@components/generic/tabs'

import Tab from './tab'

interface Props {
  id: string
  group: GroupEntityType
}

function GroupContentTabs({ id, group }: Props) {
  const groupType = getGroupTypeDefinition(group.type)
  const currentUser = useUser()
  const contentTypes: ContentTypeDefinition[] = useMemo(
    () =>
      groupType.contentTypes
        .map((type) => {
          const canSee = groupContentPermission(
            currentUser.user,
            group.type,
            type.slug,
            'read',
            group
          )

          return canSee ? getContentTypeDefinition(type.slug) : undefined
        })
        .filter(Boolean),
    [groupType, currentUser]
  )

  const contentType = useMemo(() => {
    const [firstElement] = contentTypes

    return firstElement
  }, [contentTypes])

  const { value: tab, onChange: handleTabChange } = useTab(contentType?.slug || 'post')

  const currentContentType = useMemo(
    () => contentTypes.find(({ slug }) => slug === tab),
    [tab, contentTypes]
  )

  const tabs = useMemo(
    () =>
      contentTypes.map((type) => ({
        label: type.title,
        id: type.slug,
        content: (
          <Tab
            currentContentType={currentContentType}
            contentType={tab}
            id={id}
            groupType={group.type}
          />
        ),
      })),
    [tab, contentTypes, currentContentType, group.type, id]
  )

  return (
    <>
      <Tabs tabs={tabs} onChange={handleTabChange} value={tab} />
    </>
  )
}

export default memo(GroupContentTabs)
