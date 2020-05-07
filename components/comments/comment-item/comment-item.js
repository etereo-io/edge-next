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
  
  // In case the user was deleted, default to an empty object
  const commentUser = props.comment.user || {
    username: 'not found',
    id: 'not-found',
    profile: {
      picture: null
    }
  }

  return (
    <>
    <div className='comment-item'>
      <div className='comment-entry'>
        <Avatar width={40} height={40} src={commentUser.profile.picture} title={`${commentUser.username} avatar`} />
        
        <div className="comment-body">
          <div className="info">
            <span className="username">
              <Link href={`/profile/${commentUser.id}`}>
                <a title={`${commentUser.username} profile`}>{commentUser.username}</a>
              </Link>
            </span>
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
          padding: var(--empz-gap-half);
          border: var(--light-border);
          border-radius: var(--empz-radius);
        }

        .comment-entry {
          display: flex;
        }

        .comment-body {
          flex: 1;
          padding-left: var(--empz-gap-half);
          padding-right: var(--empz-gap-half);
        }

        .info, .content, .actions {
          margin-bottom: var(--empz-gap-half);
        }

        .username {
          font-weight: bold;
          margin-right: var(--empz-gap-half);
        }

        .username a {
          color: var(--empz-foreground);
          text-decoration: none;
        }

        .meta {
          font-size: 13px;
          color: var(--accents-3);
        }

        .actions {
          color: var(--accents-4);
          font-weight: bold;
          font-size: 13px;
        }

        .collapsed-comment {
          font-weight: bold;
          margin-top: var(--empz-gap-half);
          font-weight: 13px;
        }
        `
      }
    </style>
    </>
  )
}
