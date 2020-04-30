import Button from '../../generic/button/button'
import { hasPermission } from '../../../lib/permissions'
import { useUser } from '../../../lib/hooks'

export default function (props) {
  const { user } = useUser({
    userId: 'me'
  })

  const hasEditPermission = hasPermission(
    user,
    [`content.${props.content.type}.admin`, `content.${props.content.type}.update`],
  )
  const isContentOwner = user && user.id === props.content.author

  return (
    <div className={`content-actions ${props.className}`}>
      {(hasEditPermission || isContentOwner) && (
        <Button href={`/edit/${props.content.type}/${props.content.slug}`}>
          Edit
        </Button>
      )}
    </div>
  )
}
