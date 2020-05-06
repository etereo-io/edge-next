import DropDown from '../../generic/dropdown-menu/dropdown-menu'
import { hasPermission } from '../../../lib/permissions'
import { useUser } from '../../../lib/hooks'


export default function (props) {
  const { user } = useUser({
    userId: 'me'
  })

  const hasEditPermission = hasPermission(
    user,
    [`content.${props.type.slug}.comments.admin`, `content.${props.type.slug}.comments.update`],
  )
  const isCommentOwner = user && user.id === props.comment.author

  return (
    <>
    <div className='comment-item'>
      <div className="posted-on">Posted on: {props.comment.createdAt}</div>
      <div className="from">Posted by: {props.comment.author}</div>
      <p>{props.comment.message}</p>
      <div className='bottomActions'>
        <DropDown align={'right'}>
          <ul>
            {!isCommentOwner && <li>Report</li>}
            {(hasEditPermission || isCommentOwner) && <li>Delete</li>}
          </ul>
        </DropDown>
      </div>
    </div>
    <style jsx>
      {
        `
        .comment-item {
          padding: var(--empz-gap);
          border: var(--light-border);
        }
        `
      }
    </style>
    </>
  )
}
