import React, { memo, useMemo } from 'react'
import { Tabs, useTab } from '@components/generic/tabs'
import { getContentTypeDefinition, getGroupTypeDefinition } from '@lib/config'
import { groupContentPermission, groupUserPermission } from '@lib/permissions'

import ContentListView from '@components/content/read-content/content-list-view/content-list-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import { GroupEntityType } from '@lib/types/entities/group'
import MembersTab from './members-tab'
import PendingMembersTab from './pending-members-tab'
import { useUser } from '@lib/client/hooks'

interface Props {
  id: string
  group: GroupEntityType
}

function GroupTabs({ id, group }: Props) {
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

  const canUpdate = groupUserPermission(
    currentUser.user,
    groupType.slug,
    'update',
    group
  )

  const { value: tab, onChange: handleTabChange } = useTab(
    contentType?.slug
  )

  const tabs = useMemo(
    () => [
      ...contentTypes.map((type) => ({
        label: type.title,
        id: type.slug,
        content: (
          <ContentListView
            type={type}
            query={`groupId=${id}&groupType=${group.type}`}
            addComments={false}
          />
        ),
      })),
      {
        label: 'Members',
        id: 'members',
        show: canUpdate,
        content: (
          <MembersTab
            groupId={id}
            groupType={group.type}
            roles={groupType.roles}
            users={group.members}
          />
        ),
      },
      {
        label: 'Pending members',
        id: 'pending-members',
        show: canUpdate,
        content: (
          <PendingMembersTab
            groupId={id}
            groupType={group.type}
            roles={groupType.roles}
            users={group.pendingMembers}
          />
        ),
      },
    ],
    [tab, contentTypes, group.type, id]
  )

  return (
    <>
      <Tabs tabs={tabs} onChange={handleTabChange} value={tab} />
    </>
  )
}

export default memo(GroupTabs)
