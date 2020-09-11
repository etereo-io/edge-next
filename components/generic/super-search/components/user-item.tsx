import React, { memo } from 'react'

import Avatar from '@components/user/avatar/avatar'
import Link from 'next/link'
import { UserType } from '@lib/types'

interface Props {
  user: Partial<UserType>
}

function UserItem({ user }: Props) {
  return (
    <div className="item">
      <Link href={`/profile/${user.id}`}>
        <a title={`${user?.username}'s profile`}><Avatar width={'20px'} user={user} /> {user?.username}</a>
      </Link>
      <style jsx>
        {`
          .item {
            line-height: 1;
            padding-right: var(--edge-gap);
            margin: 0;
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  )
}

export default memo(UserItem)
