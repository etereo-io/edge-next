import { useUser, useContentOwner } from '../../../lib/hooks'
import config from '../../../lib/config'
import { hasPermission } from '../../../lib/permissions'
import Link from 'next/link'
import Button from '../../button/button'

export default function(props) {
  const { user } = useUser()
  const { content } = props

  const hasEditPermission = hasPermission(user, `content.${props.content.type}.admin`)
  const isContentOwner = useContentOwner(props.content)

  return (
    <div className="content-actions">
      { (hasEditPermission || isContentOwner) && (
        <Button href={`/edit/${props.content.type}/${props.content.slug}`}>
          Edit
        </Button>
      )}
    </div>
  )
}