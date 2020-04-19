import { useContentOwner, useUser } from '../../../lib/hooks'

import Button from '../../button/button'
import Link from 'next/link'
import { hasPermission } from '../../../lib/permissions'

export default function(props) {
  const { user } = useUser()

  const hasEditPermission = hasPermission(user, `content.${props.content.type}.admin`)
  const isContentOwner = useContentOwner(props.content)

  return (
    <div className={`content-actions ${props.className}`}>
      { (hasEditPermission || isContentOwner) && (
        <Button href={`/edit/${props.content.type}/${props.content.slug}`}>
          Edit
        </Button>
      )}
    </div>
  )
}