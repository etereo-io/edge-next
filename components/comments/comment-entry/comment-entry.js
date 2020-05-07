import DropDown from '../../generic/dropdown-menu/dropdown-menu'
import { hasPermission } from '../../../lib/permissions'
import { useUser, usePermission } from '../../../lib/hooks'
import Avatar from '../../user/avatar/avatar'
import { format } from 'timeago.js'
import { useState } from 'react'
import CommentForm from '../comment-form/comment-form'
import Link from 'next/link'

export default function CommentEntry({
  contentId = '',
  conversationId = '',
  type = {},
  comment = {},
  onCommentAdded = () => {},
}) {
  // Reply form
  const [showReplyForm, setShowReplyForm] = useState(false)

  const { user } = useUser({
    userId: 'me',
  })

  const canWriteComments = usePermission([
    `content.${type.slug}.comments.create`,
  ])

  const hasEditPermission = hasPermission(user, [
    `content.${type.slug}.comments.admin`,
    `content.${type.slug}.comments.update`,
  ])
  const isCommentOwner = user && user.id === comment.author

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

  return (
    <>
      <div className="comment-entry">
        <Link href={`/profile/${commentUser.id}`}>
          <a title={`${commentUser.username} profile`}>
            <Avatar
              width={40}
              height={40}
              src={commentUser.profile.picture}
              title={`${commentUser.username} avatar`}
            />
          </a>
        </Link>

        <div className="comment-body">
          <div className="info">
            <span className="username">
              <Link href={`/profile/${commentUser.id}`}>
                <a title={`${commentUser.username} profile`}>
                  {commentUser.username}
                </a>
              </Link>
            </span>
            <span className="meta">
              <span className="time">{format(comment.createdAt)}</span>
            </span>
          </div>
          <div className="content">{comment.message}</div>
          <div className="actions">
            {canWriteComments.available && (
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
              {!isCommentOwner && <li>Report</li>}
              {(hasEditPermission || isCommentOwner) && <li>Delete</li>}
            </ul>
          </DropDown>
        </div>
      </div>
      <style jsx>{`
        .comment-entry {
          display: flex;
        }

        .comment-body {
          flex: 1;
          padding-left: var(--empz-gap-half);
          padding-right: var(--empz-gap-half);
        }

        .info,
        .content,
        .actions {
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
      `}</style>
    </>
  )
}
