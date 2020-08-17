import LinkList from '../../../generic/link-list/link-list'
import { useContentTypes } from '@lib/client/hooks'

export default function Named() {
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
