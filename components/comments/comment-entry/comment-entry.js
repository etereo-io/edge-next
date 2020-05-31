import DropDown from '../../generic/dropdown-menu/dropdown-menu'
import { commentPermission } from '@lib/permissions'
import { useUser } from '@lib/client/hooks'
import { format } from 'timeago.js'
import AuthorBox from '../../user/author-box/author-box'
import { useState } from 'react'
import CommentForm from '../comment-form/comment-form'
import MarkdownRead from '@components/generic/markdown-read/markdown-read'

import MarkdownIt from 'markdown-it'
const md = MarkdownIt({
  html: false,
  linkify: true,
}).disable(['heading', 'hr', 'table'])

export default function CommentEntry({
  contentId = '',
  conversationId = '',
  type = {},
  comment = {},
  onCommentAdded = () => {},
  onCommentDeleted = () => {},
}) {
  // Reply form
  const [showReplyForm, setShowReplyForm] = useState(false)

  // Check permissions to edit
  const currentUser = useUser()
  const hasEditPermission = commentPermission(
    currentUser.user,
    type.slug,
    'update',
    comment
  )
  const hasWritePermission = commentPermission(
    currentUser.user,
    type.slug,
    'create',
    comment
  )

  // In case the user was deleted, default to an empty object
  const commentUser = comment.user || {
    username: 'not found',
    id: 'not-found',
    profile: {
      picture: {
        path: null,
      },
    },
  }

  const onReply = (c) => {
    setShowReplyForm(false)
    onCommentAdded(c)
  }

  const onClickDeleteComment = (ev) => {
    ev.preventDefault()
    onCommentDeleted(comment)
    // TODO: Call the api
  }

  const htmlString = md.render(comment.message || '')

  return (
    <>
      <div className="comment-entry">
        <div className="comment-body">
          <div className="info">
            <AuthorBox user={commentUser} />

            <span className="meta">
              <span className="time">{format(comment.createdAt)}</span>
            </span>
          </div>
          <div className="content">
            <MarkdownRead htmlString={htmlString} />
          </div>
          <div className="actions">
            {hasWritePermission && !showReplyForm && (
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
              {hasEditPermission && (
                <li>
                  <a title="Delete comment" onClick={onClickDeleteComment}>
                    Delete
                  </a>
                </li>
              )}
            </ul>
          </DropDown>
        </div>
      </div>
      <style jsx>{`
        .comment-entry {
          display: flex;
          padding: var(--edge-gap);
        }

        @media (max-width: 600px) {
          .comment-entry {
            padding: var(--edge-gap-half);
          }
        }

        .comment-body {
          flex: 1;
        }

        .info,
        .content {
          margin-bottom: var(--edge-gap-half);
        }

        .actions {
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
