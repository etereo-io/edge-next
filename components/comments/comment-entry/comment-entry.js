import DropDown from '../../generic/dropdown-menu/dropdown-menu'
import { commentPermission } from '../../../lib/permissions'
import { useUser } from '../../../lib/client/hooks'
import { format } from 'timeago.js'
import AuthorBox from '../../user/author-box/author-box'
import { useState } from 'react'
import CommentForm from '../comment-form/comment-form'


export default function CommentEntry({
  contentId = '',
  conversationId = '',
  type = {},
  comment = {},
  onCommentAdded = () => {},
  onCommentDeleted= () => {}
}) {
  // Reply form
  const [showReplyForm, setShowReplyForm] = useState(false)

  // Check permissions to edit
  const currentUser = useUser()
  const hasEditPermission = commentPermission(currentUser.user, type.slug, 'update', comment)
  const hasWritePermission = commentPermission(currentUser.user, type.slug, 'create', comment)

  // In case the user was deleted, default to an empty object
  const commentUser = comment.user || {
    username: 'not found',
    id: 'not-found',
    profile: {
      picture: null,
    },
  }

  const onReply = (c) => {
    setShowReplyForm(false)
    onCommentAdded(c)
  }

  const onClickDeleteComment = ev => {
    ev.preventDefault()
    onCommentDeleted(comment)
    // TODO: Call the api
  }

  return (
    <>
      <div className="comment-entry">
        
     
        <div className="comment-body">
          <div className="info">
            <AuthorBox user={commentUser } />
            
            <span className="meta">
              <span className="time">{format(comment.createdAt)}</span>
            </span>
          </div>
          <div className="content">{comment.message}</div>
          <div className="actions">
            {hasWritePermission && !showReplyForm &&  (
              <span
                onClick={() => {
                  setShowReplyForm(true)
                }}
              >
                Reply
              </span>
            )}
          </div>
          {showReplyForm && (
            <div className="reply-wrapper">
              <CommentForm
                comment={{ message: `@${commentUser.username} ` }}
                onCancel={() => setShowReplyForm(false)}
                onSave={onReply}
                type={type}
                contentId={contentId}
                conversationId={conversationId}
              />
            </div>
          )}
        </div>

        <div className="side-actions">
          <DropDown align={'right'}>
            <ul>
              <li>Report</li>
              {hasEditPermission && <li><a title="Delete comment" onClick={onClickDeleteComment}>Delete</a></li>}
            </ul>
          </DropDown>
        </div>
      </div>
      <style jsx>{`
        .comment-entry {
          display: flex;
          padding: var(--empz-gap);
        }

        .comment-body {
          flex: 1;
          padding-left: var(--empz-gap-half);
          padding-right: var(--empz-gap-half);
        }

        .info,
        .content {
          margin-bottom: var(--empz-gap-half);
        }

        .actions{
          cursor: pointer;
        }

        .meta {
          font-size: 13px;
          color: var(--accents-7);
        }

        .actions {
          color: var(--accents-7);
          font-weight: bold;
          font-size: 13px;
        }
      `}</style>
    </>
  )
}
