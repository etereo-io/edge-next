import LinkList from '../../../generic/link-list/link-list'
import config from '../../../../lib/config'
import { hasPermission } from '../../../../lib/permissions'
import styles from './list-content-types.module.scss'
import { useUser } from '../../../../lib/hooks'

export default function () {
  const { user } = useUser()

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
    <div className={styles.listContentTypes}>
      <LinkList links={links} />
    </div>
  )
}
