import Link from 'next/link'
import React, { memo } from 'react'

import { UserType } from '@lib/types'

interface Props {
  user: Partial<UserType>
}

function UserItem({ user: { id, username } }: Props) {
  return (
    <div className="item">
      <Link href={`/profile/${id}`}>
        <a>{username}</a>
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
