import React, { memo } from 'react'

import StackedAvatars from '@components/generic/stacked-avatars'

function GroupMembers({ members = [], visible = 3 }) {
  return (
    <>
      <div className="group-members">
        <div className="members-wrapper">
          <StackedAvatars
            title="members"
            width="32px"
            maxItems={visible}
            users={members}
          />
        </div>
      </div>
    </>
  )
}

export default memo(GroupMembers)
