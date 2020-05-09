import Button from '../../generic/button/button'
import { contentPermission } from '../../../lib/permissions'
import { useUser } from '../../../lib/hooks'

export default function (props) {
  // Check permissions to edit
  const currentUser = useUser()
  const canEdit = contentPermission(currentUser.user, props.content.type, 'update', props.content)

  return (
    <div className={`content-actions ${props.className}`}>
      {canEdit && (
        <Button href={`/edit/${props.content.type}/${props.content.slug}`}>
          Edit
        </Button>
      )}
    </div>
  )
}
