import Link from 'next/link'
import React, { memo } from 'react'

import { ContentTypeDefinition } from '@lib/types'

interface Props {
  items: Partial<ContentTypeDefinition>[]
  name: string
}

function ContentItems({ items, name }: Props) {
  return (
    <>
      {!!items.length && (
        <>
          <div className="name"> {name}</div>
          {items.map(({ slug, title, type }) => (
            <div key={slug} className="item">
              <Link href={`/content/${type}/${slug}`}>
                <a>{title}</a>
              </Link>
            </div>
          ))}
        </>
      )}
      <style jsx>
        {`
          .name {
            font-size: 1.5rem;
          }
          .name::first-letter {
            text-transform: uppercase;
          }
          .item {
            line-height: 1;
            margin-bottom: var(--edge-gap);
            padding-right: var(--edge-gap);
            font-size: 1rem;
          }
        `}
      </style>
    </>
  )
}

export default memo(ContentItems)
