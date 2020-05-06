import DropDown from '../../generic/dropdown-menu/dropdown-menu'
import { hasPermission } from '../../../lib/permissions'
import { useUser } from '../../../lib/hooks'
import Avatar from '../../user/avatar/avatar'
import { format } from 'timeago.js';
import Link from 'next/link'

export default function (props) {
  const { user } = useUser({
    userId: 'me'
  })

  const hasEditPermission = hasPermission(
    user,
    [`content.${props.type.slug}.comments.admin`, `content.${props.type.slug}.comments.update`],
  )
  const isCommentOwner = user && user.id === props.comment.author
console.log(props.comment.user)
  return (
    <>
    <div className='comment-item'>
      <div className='comment-entry'>
        <Avatar src={props.comment.user.profile.picture} title={`${props.comment.user.username} avatar`} />
        
        <div className="comment-body">
          <div className="info">
            <Link href={`/profile/${props.comment.author}`}>
              <a title={`${props.comment.user.username} profile`}>{props.comment.user.username}</a>
            </Link>
            <span className="meta">
              <span className="time">{format(props.comment.createdAt)}</span>
            </span>
            
          </div>
          <div className="content">
              {props.comment.message}
          </div>
          <div className="actions">
            <span>Reply</span>
          </div>
        </div>
        
        <div className='side-actions'>
          <DropDown align={'right'}>
            <ul>
              {!isCommentOwner && <li>Report</li>}
              {(hasEditPermission || isCommentOwner) && <li>Delete</li>}
            </ul>
          </DropDown>
        </div>
      </div>
      <div className='collapsed-comment'>
        <a >View 6 replies</a>
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
