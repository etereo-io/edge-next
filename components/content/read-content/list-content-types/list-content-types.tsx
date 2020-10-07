import React, { memo } from 'react'

import { useContentTypes } from '@lib/client/hooks'
import LinkList from '@components/generic/link-list/link-list'

function ListContentTypes() {
  const contentTypes = useContentTypes(['read', 'admin'])

  const links = contentTypes.map((type) => {
    return {
      link: `/content/${type.slug}`,
      title: `See all ${type.title}`,
    }
  })

  return (
    <>
      <div className="listContentTypes">
        <LinkList links={links} />
      </div>

      <style jsx>{`
        .listContentTypes {
          margin-bottom: var(--edge-gap-double);
        }
      `}</style>
    </>
  )
}

export default memo(ListContentTypes)
