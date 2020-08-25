import { memo } from 'react'

import { getContentTypeDefinition, getGroupTypeDefinition } from '@lib/config'
import Button from '@components/generic/button/button'
import { GroupEntityType } from '@lib/types'
import { groupContentPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'

interface Props {
  group: GroupEntityType
}

function GroupContentMenu(props: Props) {
  const { group = {} as GroupEntityType } = props
  // Check permissions to edit
  const currentUser = useUser()

  const groupType = getGroupTypeDefinition(group.type)

  const contentTypes = groupType.contentTypes.map((type) => {
    const canCreate = groupContentPermission(
      currentUser.user,
      group.type,
      type.slug,
      'create',
      group
    )

    if (canCreate) {
      const contentType = getContentTypeDefinition(type.slug)

      return (
        <div key={type.slug} className="content-action">
          <Button
            href={`/create/content/${type.slug}?groupId=${group.id}&groupType=${group.type}`}
            title={`Create a ${contentType.title}`}
          >
            Create a {contentType.title}
          </Button>
        </div>
      )
    }
  })

  return <div className={`content-actions`}>{contentTypes}</div>
}

export default memo(GroupContentMenu)
