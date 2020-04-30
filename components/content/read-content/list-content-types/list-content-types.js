import LinkList from '../../../generic/link-list/link-list'
import config from '../../../../lib/config'
import { hasPermission } from '../../../../lib/permissions'

import { useUser } from '../../../../lib/hooks'

export default function () {
  const { user } = useUser({
    userId: 'me'
  })

  const links = config.content.types
    .filter((type) => {
      return hasPermission(user, `content.${type.slug}.read`)
    })
    .map((type) => {
      return {
        link: `/content/${type.slug}`,
        title: `Read all ${type.title.en}s`,
      }
    })

  return (
    <>
    <div className='listContentTypes'>
      <LinkList links={links} />
    </div>

  <style jsx>{`
  .listContentTypes {
    margin-bottom: var(--empz-gap-double);
  }
  `}</style>
  </>
  )
}
