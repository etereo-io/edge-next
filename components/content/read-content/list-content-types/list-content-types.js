import { memo } from 'react'

import LinkList from '../../../generic/link-list/link-list'
import { useContentTypes } from '@lib/client/hooks'

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
