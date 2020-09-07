import Link from 'next/link'
import React, { memo } from 'react'

import { GroupEntityType } from '@lib/types'

interface Props {
  group: Partial<GroupEntityType>
}

function GroupItems({ group: { type, slug, title, description } }: Props) {
  return (
    <>
      <div key={slug} className="item">
        <Link href={`/group/${type}/${slug}`}>
          <a>{title}</a>
        </Link>
        <div className="description">{description}</div>
      </div>
      <style jsx>
        {`
          .item {
            line-height: 1;
            margin-bottom: var(--edge-gap);
            padding-right: var(--edge-gap);
            font-size: 1rem;
          }

          .description {
            word-wrap: break-word;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-text-decoration: none;
            text-decoration: none;
            padding-top: 5px;
            color: var(--accents-5);
          }
        `}
      </style>
    </>
  )
}

export default memo(GroupItems)
