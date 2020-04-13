import { useUser } from '../../../../lib/hooks'
import config from '../../../../lib/config'
import { hasPermission } from '../../../../lib/permissions'
import Link from 'next/link'

export default function () {
  const { user } = useUser()

  return (
    <div className="available-content-types">
      <ul>
        {config.content.types
          .filter((type) => {
            return hasPermission(user, `content.${type.slug}.read`)
          })
          .map((type) => {
            return (
              <li>
                <Link href={`/content/${type.slug}`}>
                  <a>Read all {type.title.en}s</a>
                </Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
