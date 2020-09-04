import { memo } from 'react'

import Button from '@components/generic/button/button'
import { GroupEntityType } from '@lib/types'
import { groupPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'

interface Props {
  group: GroupEntityType
}
function GroupActions(props: Props) {
  const { group = {} as GroupEntityType } = props
  // Check permissions to edit
  const currentUser = useUser()

  const canEdit = groupPermission(currentUser.user, group.type, 'update', group)

  return (
      <div className={`content-actions`}>
        {canEdit && (
          <Button href={`/edit/group/${group.type}/${group.slug}`}>Edit</Button>
        )}
      </div>
  )
}

export default memo(GroupActions)
